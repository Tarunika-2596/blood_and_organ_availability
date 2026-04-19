const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', hospitalController.getAllHospitals);
router.get('/my-hospital', auth, authorize('hospital'), hospitalController.getMyHospital);
router.put('/my-hospital', auth, authorize('hospital'), hospitalController.updateMyHospital);
router.put('/:id/approve', auth, authorize('admin'), hospitalController.approveHospital);
router.put('/:id/disable', auth, authorize('admin'), hospitalController.disableHospital);

module.exports = router;
