const { pool } = require('../config/db');

exports.getMyHospital = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    if (!hospitalId) return res.status(403).json({ message: 'Access denied. Hospital only.' });
    const result = await pool.query(
      'SELECT id, name, address, city, contact_number as "contactNumber" FROM hospitals WHERE id=$1',
      [hospitalId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMyHospital = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    if (!hospitalId) return res.status(403).json({ message: 'Access denied. Hospital only.' });
    const { name, address, city, contactNumber } = req.body;
    const result = await pool.query(
      'UPDATE hospitals SET name=$1, address=$2, city=$3, contact_number=$4 WHERE id=$5 RETURNING id, name, address, city, contact_number as "contactNumber"',
      [name, address, city, contactNumber, hospitalId]
    );
    res.json({ message: 'Hospital details updated successfully', hospital: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, address, city, contact_number as "contactNumber", is_approved as "isApproved", is_active as "isActive", created_at as "createdAt" FROM hospitals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveHospital = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE hospitals SET is_approved=true WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    res.json({ message: 'Hospital approved', hospital: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.disableHospital = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE hospitals SET is_active=false WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    res.json({ message: 'Hospital disabled', hospital: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
