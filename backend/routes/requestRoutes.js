const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { auth } = require('../middleware/auth');

router.post('/create', auth, requestController.createRequest);
router.get('/my-requests', auth, requestController.getUserRequests);

module.exports = router;
