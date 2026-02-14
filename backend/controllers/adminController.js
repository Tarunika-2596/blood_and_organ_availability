const Hospital = require('../models/Hospital');
const UpdateLog = require('../models/UpdateLog');

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await UpdateLog.find()
      .populate('hospitalId', 'name')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
