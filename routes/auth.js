const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path as necessary
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyOtp } = require('../utils/EmailOtpVerification'); // Adjust the path as necessary
require('dotenv').config();
const pendingUsers = require('../utils/tempRegistrations'); // Adjust the path as necessary

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if all fields exist
        if (!name || !password || !role || (!email && !phone)) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // OTP generation and Storage 
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // expires in 2 minutes

        // create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role, 
            otp,
            otpExpiresAt,
            isVerified: false
        });

        // Save to user model
        newUser.otp = otp;
        newUser.otpExpiresAt = otpExpiresAt;

        const sendEmailOTP = require('../utils/sendEmailOTP');

        if (email) {
        await sendEmailOTP(email, otp);
        }

        // // Send OTP to the user via phone 
        // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

        // await client.messages.create({
        // body: `Your OTP for Salon App is ${otp}. It expires in 5 minutes.`,
        // from: process.env.TWILIO_PHONE,
        // to: user.phone
        // });
        const tempKey = email || phone;
        pendingUsers.set(tempKey, {
        name, email, phone, password, role, otp, otpExpiresAt
        });
        return res.status(200).json({ msg: 'OTP sent. Please verify to complete registration.' });
    }
    catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body; 
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Create JWT payload
        const payload = {
            userId: user._id,
            role: user.role
        };

        // Sign the JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with token and user details
        res.status(200).json({
            msg: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/verify-otp', verifyOtp);
module.exports = router;
