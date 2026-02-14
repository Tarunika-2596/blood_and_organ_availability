const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalControllerMock');
const { auth, authorize } = require('../middleware/auth');

router.get('/', hospitalController.getAllHospitals);
router.put('/:id/approve', auth, authorize('admin'), hospitalController.approveHospital);
router.put('/:id/disable', auth, authorize('admin'), hospitalController.disableHospital);

module.exports = router;
