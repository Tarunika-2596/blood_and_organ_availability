const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  unitsAvailable: { type: Number, required: true, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
