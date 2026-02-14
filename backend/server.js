require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const connectDB = require('./config/db'); // DB disabled

const authRoutes = require('./routes/authRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const organRoutes = require('./routes/organRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

// connectDB(); // DB disabled - using mock data

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/organs', organRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} (Mock Mode - No Database)`));
