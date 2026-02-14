const { requests, hospitals, getNextId } = require('../mockData');

exports.createRequest = async (req, res) => {
  try {
    const { type, item, hospitalId, message } = req.body;
    const userId = req.user.userId;

    const request = {
      _id: getNextId(),
      userId,
      userName: req.user.name || 'User',
      type,
      item,
      hospitalId,
      message,
      status: 'Pending',
      createdAt: new Date()
    };

    requests.push(request);
    res.json({ message: 'Request submitted successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRequests = requests.filter(r => r.userId === userId);
    res.json(userRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
