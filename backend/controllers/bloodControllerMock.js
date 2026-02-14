const { bloodStocks, hospitals, updateLogs, getNextId } = require('../mockData');

exports.searchBlood = async (req, res) => {
  try {
    const { group, city } = req.query;

    let results = bloodStocks.map(stock => {
      const hospital = hospitals.find(h => h._id === stock.hospitalId);
      if (!hospital || !hospital.isApproved || !hospital.isActive) return null;
      if (city && hospital.city !== city) return null;
      if (group && stock.bloodGroup !== group) return null;

      return {
        hospitalName: hospital.name,
        address: hospital.address,
        contactNumber: hospital.contactNumber,
        bloodGroup: stock.bloodGroup,
        unitsAvailable: stock.unitsAvailable,
        lastUpdated: stock.lastUpdated,
        isOutdated: (Date.now() - new Date(stock.lastUpdated)) > 24 * 60 * 60 * 1000
      };
    }).filter(Boolean);

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

    let bloodStock = bloodStocks.find(b => b.hospitalId === hospitalId && b.bloodGroup === bloodGroup);
    const previousValue = bloodStock ? bloodStock.unitsAvailable.toString() : '0';

    if (bloodStock) {
      bloodStock.unitsAvailable = unitsAvailable;
      bloodStock.lastUpdated = new Date();
    } else {
      bloodStock = { _id: getNextId(), hospitalId, bloodGroup, unitsAvailable, lastUpdated: new Date() };
      bloodStocks.push(bloodStock);
    }

    updateLogs.push({
      _id: getNextId(),
      hospitalId,
      type: 'Blood',
      updatedField: bloodGroup,
      previousValue,
      newValue: unitsAvailable.toString(),
      timestamp: new Date()
    });

    res.json({ message: 'Blood stock updated successfully', bloodStock });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
