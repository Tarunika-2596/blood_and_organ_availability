const { hospitals, updateLogs } = require('../mockData');

exports.getHospitals = async (req, res) => {
  try {
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logsWithHospitals = updateLogs.map(log => ({
      ...log,
      hospitalId: { name: hospitals.find(h => h._id === log.hospitalId)?.name || 'Unknown' }
    }));
    res.json(logsWithHospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
