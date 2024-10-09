const express = require('express');
const { register, login, forgetPassword, verifyOtp, getProfile, updateProfile, logout, deleteAccount, resetPassword } = require('../Controllers/AdminController');
const authMiddleware = require('../Middleware/AdminAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Routes that require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);
router.delete('/delete-account', authMiddleware, deleteAccount);

module.exports = router;