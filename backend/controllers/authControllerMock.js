const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, hospitals, getNextId } = require('../mockData');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hospitalData } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let hospitalId = null;
    if (role === 'hospital' && hospitalData) {
      const hospital = { _id: getNextId(), ...hospitalData, isApproved: true, isActive: true };
      hospitals.push(hospital);
      hospitalId = hospital._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { _id: getNextId(), name, email, password: hashedPassword, role: role || 'user', hospitalId };
    users.push(user);

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const hospital = user.hospitalId ? hospitals.find(h => h._id === user.hospitalId) : null;

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role, hospitalId: user.hospitalId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, hospitalId: hospital } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
