const mongoose = require('mongoose');

const updateLogSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  type: { type: String, required: true, enum: ['Blood', 'Organ'] },
  updatedField: { type: String, required: true },
  previousValue: { type: String },
  newValue: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UpdateLog', updateLogSchema);
