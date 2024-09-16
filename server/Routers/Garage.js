const express = require('express');
const { register, login, forgetPassword, verifyOtp, getProfile, updateProfile, logout, deleteAccount } = require('./controllers/adminController');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

router.post('/register', upload.single('profileImage'),register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtp);

// Routes that require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);
router.delete('/delete-account', authMiddleware, deleteAccount);

module.exports = router;
