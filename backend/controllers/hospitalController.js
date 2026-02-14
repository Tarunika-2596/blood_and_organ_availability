const Hospital = require('../models/Hospital');

exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ message: 'Hospital approved', hospital });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.disableHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json({ message: 'Hospital disabled', hospital });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
