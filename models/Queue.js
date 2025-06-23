// models/Queue.js
const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  joinedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['waiting', 'served', 'skipped'],
    default: 'waiting'
  },
  estimatedTime: { type: Date },
  notifiedAt: { type: Date, default: null },
  currentPosition: { type: Number }
});

// ✅ Fast lookup for salon queue
queueSchema.index({ salonId: 1, status: 1 });

// ✅ Prevent duplicate queue join
queueSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Queue', queueSchema);
