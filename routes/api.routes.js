var express = require('express');
var router = express.Router();

// Require controller modules
var profileController = require('../controllers/profileController');

// ***************** PROFILE ROUTES *****************
// GET Profile data
router.get('/profile', profileController.profile_get);
// UPDATE Profile data
router.post('/profile/update', profileController.profile_update);

module.exports = router;