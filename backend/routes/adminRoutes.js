const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.get('/hospitals', auth, authorize('admin'), adminController.getHospitals);
router.get('/logs', auth, authorize('admin'), adminController.getLogs);

module.exports = router;
