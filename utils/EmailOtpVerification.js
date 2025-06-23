const bcrypt = require('bcryptjs');
const User = require('../models/user');
const pendingUsers = require('../utils/tempRegistrations'); // Adjust the path as necessary

const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;
  const tempKey = email || phone;

  const tempUser = pendingUsers.get(tempKey);

  if (!tempUser) {
    return res.status(404).json({ msg: 'No pending registration found. Please register again.' });
  }

  if (tempUser.otp !== otp) {
    return res.status(400).json({ msg: 'Invalid OTP' });
  }

  if (new Date(tempUser.otpExpiresAt) < new Date()) {
    pendingUsers.delete(tempKey);
    return res.status(400).json({ msg: 'OTP expired. Please register again.' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempUser.password, salt);

    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      phone: tempUser.phone,
      role: tempUser.role,
      password: hashedPassword,
      isVerified: true
    });

    await newUser.save();

    pendingUsers.delete(tempKey);

    return res.status(201).json({ msg: 'User verified and registered successfully' });
  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ msg: 'Error saving user to DB' });
  }
};

module.exports = { verifyOtp };
