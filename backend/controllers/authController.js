const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hospitalData } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let hospitalId = null;
    if (role === 'hospital' && hospitalData) {
      const hospital = new Hospital(hospitalData);
      await hospital.save();
      hospitalId = hospital._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, hospitalId });
    await user.save();

    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('hospitalId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'hospital' && user.hospitalId && !user.hospitalId.isApproved) {
      return res.status(403).json({ message: 'Hospital not approved yet' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, hospitalId: user.hospitalId?._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, hospitalId: user.hospitalId } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
