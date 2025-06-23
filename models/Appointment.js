// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  scheduledTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled', 'no_show'],
    default: 'booked'
  },
  payment: {
    status: { type: String, enum: ['paid', 'failed'], required: true },
    method: { type: String, enum: ['upi', 'card', 'wallet'], required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Compound index to prevent multiple active bookings
appointmentSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
