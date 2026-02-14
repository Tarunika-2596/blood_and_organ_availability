const OrganAvailability = require('../models/OrganAvailability');
const UpdateLog = require('../models/UpdateLog');

exports.searchOrgans = async (req, res) => {
  try {
    const { organ, city } = req.query;

    const query = {};
    if (organ) query.organType = organ;

    const organs = await OrganAvailability.find(query)
      .populate({
        path: 'hospitalId',
        match: city ? { city, isApproved: true, isActive: true } : { isApproved: true, isActive: true }
      })
      .sort({ lastUpdated: -1 });

    const results = organs
      .filter(org => org.hospitalId)
      .map(org => ({
        hospitalName: org.hospitalId.name,
        address: org.hospitalId.address,
        contactNumber: org.hospitalId.contactNumber,
        organType: org.organType,
        status: org.status,
        lastUpdated: org.lastUpdated,
        isOutdated: (Date.now() - new Date(org.lastUpdated)) > 24 * 60 * 60 * 1000
      }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrgan = async (req, res) => {
  try {
    const { organType, status } = req.body;
    const hospitalId = req.user.hospitalId;

    let organ = await OrganAvailability.findOne({ hospitalId, organType });
    const previousValue = organ ? organ.status : 'Not Available';

    if (organ) {
      organ.status = status;
      organ.lastUpdated = Date.now();
    } else {
      organ = new OrganAvailability({ hospitalId, organType, status });
    }

    await organ.save();

    await new UpdateLog({
      hospitalId,
      type: 'Organ',
      updatedField: organType,
      previousValue,
      newValue: status
    }).save();

    res.json({ message: 'Organ availability updated successfully', organ });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
