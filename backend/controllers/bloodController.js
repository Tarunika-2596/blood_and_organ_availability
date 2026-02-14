const BloodStock = require('../models/BloodStock');
const UpdateLog = require('../models/UpdateLog');

exports.searchBlood = async (req, res) => {
  try {
    const { group, city } = req.query;

    const query = {};
    if (group) query.bloodGroup = group;

    const bloodStocks = await BloodStock.find(query)
      .populate({
        path: 'hospitalId',
        match: city ? { city, isApproved: true, isActive: true } : { isApproved: true, isActive: true }
      })
      .sort({ lastUpdated: -1 });

    const results = bloodStocks
      .filter(stock => stock.hospitalId)
      .map(stock => ({
        hospitalName: stock.hospitalId.name,
        address: stock.hospitalId.address,
        contactNumber: stock.hospitalId.contactNumber,
        bloodGroup: stock.bloodGroup,
        unitsAvailable: stock.unitsAvailable,
        lastUpdated: stock.lastUpdated,
        isOutdated: (Date.now() - new Date(stock.lastUpdated)) > 24 * 60 * 60 * 1000
      }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBlood = async (req, res) => {
  try {
    const { bloodGroup, unitsAvailable } = req.body;
    const hospitalId = req.user.hospitalId;

    if (unitsAvailable < 0) {
      return res.status(400).json({ message: 'Units cannot be negative' });
    }

    let bloodStock = await BloodStock.findOne({ hospitalId, bloodGroup });
    const previousValue = bloodStock ? bloodStock.unitsAvailable.toString() : '0';

    if (bloodStock) {
      bloodStock.unitsAvailable = unitsAvailable;
      bloodStock.lastUpdated = Date.now();
    } else {
      bloodStock = new BloodStock({ hospitalId, bloodGroup, unitsAvailable });
    }

    await bloodStock.save();

    await new UpdateLog({
      hospitalId,
      type: 'Blood',
      updatedField: bloodGroup,
      previousValue,
      newValue: unitsAvailable.toString()
    }).save();

    res.json({ message: 'Blood stock updated successfully', bloodStock });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
