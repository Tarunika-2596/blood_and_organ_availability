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

exports.getStats = async (req, res) => {
  try {
    const [hospitals, requests, blood, organs] = await Promise.all([
      pool.query(`SELECT COUNT(*) as total, SUM(CASE WHEN is_approved THEN 1 ELSE 0 END) as approved, SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inactive, SUM(CASE WHEN NOT is_approved THEN 1 ELSE 0 END) as pending FROM hospitals`),
      pool.query(`SELECT COUNT(*) as total, SUM(CASE WHEN status='Pending' THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status='Fulfilled' THEN 1 ELSE 0 END) as fulfilled FROM requests`),
      pool.query(`SELECT SUM(units_available) as total_units FROM blood_stocks`),
      pool.query(`SELECT COUNT(*) as total, SUM(CASE WHEN status='Available' THEN 1 ELSE 0 END) as available FROM organ_availabilities`),
    ]);
    res.json({
      hospitals: hospitals.rows[0],
      requests: requests.rows[0],
      blood: blood.rows[0],
      organs: organs.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
