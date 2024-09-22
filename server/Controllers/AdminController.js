const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../Models/Admin');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Preference = require('../Models/Preference'); // Preference model


// In-memory storage for OTPs
const otpStore = new Map();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const register = async(req, res) => {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request body to get all user data
    const { username, email, password, preferences } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin (user) in the database
        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword,
        });

        // If preferences are provided, save them in the Preference model
        if (preferences && Array.isArray(preferences)) {
            const preferenceRecords = preferences.map(preference => ({
                name: preference, // Assuming `name` is the field for preference in the Preference model
                adminId: admin.id, // Associate with the created admin's ID
            }));

            // Bulk create preferences
            await Preference.bulkCreate(preferenceRecords);
        }

        // Send success response
        res.status(201).json({ message: 'Registration successful', admin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


// Login
const login = async(req, res) => {
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
            httpOnly: true,
            maxAge: 3600000,
        });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Forget Password - Step 1
const forgetPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) return res.status(404).send('User not found');

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

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
const verifyOtp = async(req, res) => {
    const { email, otp } = req.body;

    try {
        const storedOtp = otpStore.get(email);
        if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
            otpStore.delete(email);
            return res.status(400).send('Invalid or expired OTP');
        }

        otpStore.delete(email);
        res.status(200).send('OTP verified');
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get User Profile
const getProfile = async(req, res) => {
    try {
        const { id } = req.admin;
        const admin = await Admin.findByPk(id);
        if (!admin) return res.status(404).send('User not found');

        res.status(200).json({
            username: admin.username,
            email: admin.email,
            profile: admin.profile
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Update User Profile (Settings)
const updateProfile = async(req, res) => {
    const { username, email } = req.body;
    const image = req.files && req.files[0] ? req.files[0].filename : nul

    try {
        const { id } = req.admin;
        const admin = await Admin.findByPk(id);
        if (!admin) return res.status(404).send('User not found');

        admin.username = username || admin.username;
        admin.email = email || admin.email;
        admin.profile = image || admin.profile
        await admin.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            admin: {
                username: admin.username,
                email: admin.email,
                profile: admin.profile
            },
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Logout
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

// Delete Account
const deleteAccount = async(req, res) => {
    try {
        const { id } = req.admin;
        const admin = await Admin.findByPk(id);
        if (!admin) return res.status(404).send('User not found');

        await admin.destroy();
        res.clearCookie('token');
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    register,
    login,
    forgetPassword,
    verifyOtp,
    getProfile,
    updateProfile,
    logout,
    deleteAccount
};