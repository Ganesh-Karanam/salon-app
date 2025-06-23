// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // ✅ Unique index
  password: { type: String, required: true },
  phone: { type: String, sparse: true }, // ✅ Unique index
  role: { type: String, enum: ['customer', 'owner'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
otp: { type: String },
  otpExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ✅ Index
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
