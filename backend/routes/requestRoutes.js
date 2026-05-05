const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { auth } = require('../middleware/auth');

router.post('/create', auth, requestController.createRequest);
router.get('/my-requests', auth, requestController.getUserRequests);
router.get('/hospital-requests', auth, authorize('hospital'), requestController.getHospitalRequests);
router.put('/:id/status', auth, authorize('hospital'), requestController.updateRequestStatus);

module.exports = router;
