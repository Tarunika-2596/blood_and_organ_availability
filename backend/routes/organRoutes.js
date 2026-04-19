const express = require('express');
const router = express.Router();
const organController = require('../controllers/organController');
const { auth, authorize } = require('../middleware/auth');

router.get('/search', organController.searchOrgans);
router.get('/my-organs', auth, authorize('hospital'), organController.getMyOrgans);
router.put('/update', auth, authorize('hospital'), organController.updateOrgan);

module.exports = router;
