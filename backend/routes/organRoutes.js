const express = require('express');
const router = express.Router();
const organController = require('../controllers/organControllerMock');
const { auth, authorize } = require('../middleware/auth');

router.get('/search', organController.searchOrgans);
router.put('/update', auth, authorize('hospital'), organController.updateOrgan);

module.exports = router;
