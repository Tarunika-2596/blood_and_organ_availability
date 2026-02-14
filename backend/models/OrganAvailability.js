const mongoose = require('mongoose');

const organAvailabilitySchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  organType: { type: String, required: true, enum: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas', 'Cornea'] },
  status: { type: String, required: true, enum: ['Available', 'Not Available'] },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrganAvailability', organAvailabilitySchema);
