const { hospitals } = require('../mockData');

exports.getAllHospitals = async (req, res) => {
  try {
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const hospital = hospitals.find(h => h._id === req.params.id);
    if (hospital) {
      hospital.isApproved = true;
      res.json({ message: 'Hospital approved', hospital });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.disableHospital = async (req, res) => {
  try {
    const hospital = hospitals.find(h => h._id === req.params.id);
    if (hospital) {
      hospital.isActive = false;
      res.json({ message: 'Hospital disabled', hospital });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
