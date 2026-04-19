const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');
const { auth, authorize } = require('../middleware/auth');

router.get('/search', bloodController.searchBlood);
router.get('/my-stock', auth, authorize('hospital'), bloodController.getMyBloodStock);
router.put('/update', auth, authorize('hospital'), bloodController.updateBlood);

module.exports = router;
