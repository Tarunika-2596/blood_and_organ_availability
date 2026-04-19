const { pool } = require('../config/db');

exports.getMyBloodStock = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const result = await pool.query(
      'SELECT blood_group as "bloodGroup", units_available as "unitsAvailable", last_updated as "lastUpdated" FROM blood_stocks WHERE hospital_id=$1 ORDER BY blood_group',
      [hospitalId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchBlood = async (req, res) => {
  try {
    const { group, city } = req.query;
    const params = [];
    let where = 'WHERE h.is_approved=true AND h.is_active=true';

    if (group) { params.push(group); where += ` AND b.blood_group=$${params.length}`; }
    if (city)  { params.push(city);  where += ` AND h.city=$${params.length}`; }

    const result = await pool.query(
      `SELECT h.name as "hospitalName", h.id as "hospitalId", h.address, h.contact_number as "contactNumber", 
              b.blood_group as "bloodGroup", b.units_available as "unitsAvailable", b.last_updated as "lastUpdated"
       FROM blood_stocks b JOIN hospitals h ON b.hospital_id=h.id
       ${where} ORDER BY b.last_updated DESC`,
      params
    );

    const results = result.rows.map(r => ({
      ...r,
      isOutdated: (Date.now() - new Date(r.last_updated)) > 24 * 60 * 60 * 1000
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

    if (unitsAvailable < 0) return res.status(400).json({ message: 'Units cannot be negative' });

    const existing = await pool.query(
      'SELECT units_available FROM blood_stocks WHERE hospital_id=$1 AND blood_group=$2',
      [hospitalId, bloodGroup]
    );
    const previousValue = existing.rows[0]?.units_available?.toString() ?? '0';

    await pool.query(
      `INSERT INTO blood_stocks (hospital_id, blood_group, units_available, last_updated)
       VALUES ($1,$2,$3,NOW())
       ON CONFLICT (hospital_id, blood_group) DO UPDATE SET units_available=$3, last_updated=NOW()`,
      [hospitalId, bloodGroup, unitsAvailable]
    );

    await pool.query(
      'INSERT INTO update_logs (hospital_id, type, updated_field, previous_value, new_value) VALUES ($1,$2,$3,$4,$5)',
      [hospitalId, 'Blood', bloodGroup, previousValue, unitsAvailable.toString()]
    );

    res.json({ message: 'Blood stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
