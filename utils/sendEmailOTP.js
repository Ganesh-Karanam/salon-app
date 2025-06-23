// utils/sendEmailOTP.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailOTP = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Salon App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your OTP for Salon App Verification',
      html: `<div style="font-family: sans-serif;">
        <h2>Your OTP is: <span style="color: #4CAF50;">${otp}</span></h2>
        <p>This code will expire in 5 minutes.</p>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending OTP email:', err.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmailOTP;
