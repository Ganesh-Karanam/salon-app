// models/Salon.js
const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere' // ✅ Geospatial index
    }
  },
  openingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  activeQueue: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Salon', salonSchema);
