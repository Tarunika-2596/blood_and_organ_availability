const { pool } = require('../config/db');

exports.getHospitals = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, address, city, contact_number as "contactNumber", is_approved as "isApproved", is_active as "isActive", created_at as "createdAt" FROM hospitals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.id, l.hospital_id as "hospitalId", l.type, l.updated_field as "updatedField", 
              l.previous_value as "previousValue", l.new_value as "newValue", l.timestamp,
              h.name as "hospitalName" 
       FROM update_logs l JOIN hospitals h ON l.hospital_id=h.id
       ORDER BY l.timestamp DESC LIMIT 100`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
