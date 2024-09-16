const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../Models/Admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory storage for OTPs
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password,phone_number } = req.body;
  const image = req.files && req.files[0] ? req.files[0].filename : null;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, email,phone_number, password: hashedPassword,image });

    res.status(201).send('Registration successful');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,  // prevents client-side JavaScript from accessing the cookie
      maxAge: 3600000, // 1 hour
    });

    // Respond with success message and token
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Forget Password - Step 1
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).send('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // OTP expires in 10 minutes

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`,
    });

    res.status(200).send('OTP sent to email');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      otpStore.delete(email); // Clean up expired OTPs
      return res.status(400).send('Invalid or expired OTP');
    }

    otpStore.delete(email); // OTP is valid, remove it
    res.status(200).send('OTP verified');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const { id } = req.admin; // Extract user ID from the token
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send('User not found');

    res.status(200).json({
      username: admin.username,
      email: admin.email,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { register, login, forgetPassword, verifyOtp, getProfile };
