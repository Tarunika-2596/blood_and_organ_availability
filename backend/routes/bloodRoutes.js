const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodControllerMock');
const { auth, authorize } = require('../middleware/auth');

router.get('/search', bloodController.searchBlood);
router.put('/update', auth, authorize('hospital'), bloodController.updateBlood);

module.exports = router;
