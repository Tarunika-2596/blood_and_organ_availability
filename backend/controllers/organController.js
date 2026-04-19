const { pool } = require('../config/db');

exports.getMyOrgans = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const result = await pool.query(
      'SELECT organ_type as "organType", status, last_updated as "lastUpdated" FROM organ_availabilities WHERE hospital_id=$1 ORDER BY organ_type',
      [hospitalId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchOrgans = async (req, res) => {
  try {
    const { organ, city } = req.query;
    const params = [];
    let where = 'WHERE h.is_approved=true AND h.is_active=true';

    if (organ) { params.push(organ); where += ` AND o.organ_type=$${params.length}`; }
    if (city)  { params.push(city);  where += ` AND h.city=$${params.length}`; }

    const result = await pool.query(
      `SELECT h.name as "hospitalName", h.id as "hospitalId", h.address, h.contact_number as "contactNumber",
              o.organ_type as "organType", o.status, o.last_updated as "lastUpdated"
       FROM organ_availabilities o JOIN hospitals h ON o.hospital_id=h.id
       ${where} ORDER BY o.last_updated DESC`,
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

exports.updateOrgan = async (req, res) => {
  try {
    const { organType, status } = req.body;
    const hospitalId = req.user.hospitalId;

    const existing = await pool.query(
      'SELECT status FROM organ_availabilities WHERE hospital_id=$1 AND organ_type=$2',
      [hospitalId, organType]
    );
    const previousValue = existing.rows[0]?.status ?? 'Not Available';

    await pool.query(
      `INSERT INTO organ_availabilities (hospital_id, organ_type, status, last_updated)
       VALUES ($1,$2,$3,NOW())
       ON CONFLICT (hospital_id, organ_type) DO UPDATE SET status=$3, last_updated=NOW()`,
      [hospitalId, organType, status]
    );

    await pool.query(
      'INSERT INTO update_logs (hospital_id, type, updated_field, previous_value, new_value) VALUES ($1,$2,$3,$4,$5)',
      [hospitalId, 'Organ', organType, previousValue, status]
    );

    res.json({ message: 'Organ availability updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
