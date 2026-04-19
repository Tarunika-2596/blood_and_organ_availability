const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hospitalData } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(400).json({ message: 'User already exists' });

    let hospitalId = null;
    if (role === 'hospital' && hospitalData) {
      const h = await pool.query(
        'INSERT INTO hospitals (name, address, city, contact_number) VALUES ($1,$2,$3,$4) RETURNING id',
        [hospitalData.name, hospitalData.address, hospitalData.city, hospitalData.contactNumber]
      );
      hospitalId = h.rows[0].id;
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role, hospital_id) VALUES ($1,$2,$3,$4,$5)',
      [name, email, hashed, role, hospitalId]
    );

    res.status(201).json({ message: 'Registration successful. Awaiting approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT u.*, h.is_approved, h.name as hospital_name 
       FROM users u LEFT JOIN hospitals h ON u.hospital_id = h.id 
       WHERE u.email=$1`,
      [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role === 'hospital' && !user.is_approved) {
      return res.status(403).json({ message: 'Hospital not approved yet' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role, hospitalId: user.hospital_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, hospitalId: user.hospital_id } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
