const { organAvailabilities, hospitals, updateLogs, getNextId } = require('../mockData');

exports.searchOrgans = async (req, res) => {
  try {
    const { organ, city } = req.query;

    let results = organAvailabilities.map(org => {
      const hospital = hospitals.find(h => h._id === org.hospitalId);
      if (!hospital || !hospital.isApproved || !hospital.isActive) return null;
      if (city && hospital.city !== city) return null;
      if (organ && org.organType !== organ) return null;

      return {
        hospitalName: hospital.name,
        address: hospital.address,
        contactNumber: hospital.contactNumber,
        organType: org.organType,
        status: org.status,
        lastUpdated: org.lastUpdated,
        isOutdated: (Date.now() - new Date(org.lastUpdated)) > 24 * 60 * 60 * 1000
      };
    }).filter(Boolean);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrgan = async (req, res) => {
  try {
    const { organType, status } = req.body;
    const hospitalId = req.user.hospitalId;

    let organ = organAvailabilities.find(o => o.hospitalId === hospitalId && o.organType === organType);
    const previousValue = organ ? organ.status : 'Not Available';

    if (organ) {
      organ.status = status;
      organ.lastUpdated = new Date();
    } else {
      organ = { _id: getNextId(), hospitalId, organType, status, lastUpdated: new Date() };
      organAvailabilities.push(organ);
    }

    updateLogs.push({
      _id: getNextId(),
      hospitalId,
      type: 'Organ',
      updatedField: organType,
      previousValue,
      newValue: status,
      timestamp: new Date()
    });

    res.json({ message: 'Organ availability updated successfully', organ });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
