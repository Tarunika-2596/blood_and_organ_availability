const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      contact_number VARCHAR(50) NOT NULL,
      is_approved BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('hospital', 'admin', 'user')),
      hospital_id INTEGER REFERENCES hospitals(id),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS blood_stocks (
      id SERIAL PRIMARY KEY,
      hospital_id INTEGER REFERENCES hospitals(id) NOT NULL,
      blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
      units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
      last_updated TIMESTAMP DEFAULT NOW(),
      UNIQUE(hospital_id, blood_group)
    );

    CREATE TABLE IF NOT EXISTS organ_availabilities (
      id SERIAL PRIMARY KEY,
      hospital_id INTEGER REFERENCES hospitals(id) NOT NULL,
      organ_type VARCHAR(50) NOT NULL CHECK (organ_type IN ('Kidney','Liver','Heart','Lungs','Pancreas','Cornea')),
      status VARCHAR(20) NOT NULL CHECK (status IN ('Available','Not Available')),
      last_updated TIMESTAMP DEFAULT NOW(),
      UNIQUE(hospital_id, organ_type)
    );

    CREATE TABLE IF NOT EXISTS update_logs (
      id SERIAL PRIMARY KEY,
      hospital_id INTEGER REFERENCES hospitals(id) NOT NULL,
      type VARCHAR(10) NOT NULL CHECK (type IN ('Blood','Organ')),
      updated_field VARCHAR(100) NOT NULL,
      previous_value VARCHAR(100),
      new_value VARCHAR(100) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      user_name VARCHAR(255),
      type VARCHAR(20),
      item VARCHAR(100),
      hospital_id INTEGER REFERENCES hospitals(id),
      message TEXT,
      status VARCHAR(20) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('PostgreSQL connected and tables initialized');
};

module.exports = { pool, initDB };
