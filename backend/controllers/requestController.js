const { pool } = require('../config/db');

exports.createRequest = async (req, res) => {
  try {
    const { type, item, hospitalId, message } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO requests (user_id, user_name, type, item, hospital_id, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [userId, req.user.name || 'User', type, item, hospitalId, message]
    );

    res.json({ message: 'Request submitted successfully', request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, h.name as hospital_name 
       FROM requests r LEFT JOIN hospitals h ON r.hospital_id=h.id 
       WHERE r.user_id=$1 ORDER BY r.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getHospitalRequests = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    if (!hospitalId) return res.status(403).json({ message: 'Access denied. Hospital only.' });

    const result = await pool.query(
      `SELECT r.*, COALESCE(u.name, r.user_name) as user_name, u.email as user_email
       FROM requests r LEFT JOIN users u ON r.user_id=u.id 
       WHERE r.hospital_id=$1 ORDER BY r.created_at DESC`,
      [hospitalId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
