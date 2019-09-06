var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    passportConf = require('../passport');;

// Require controller modules
var authControler = require('../controllers/authController');

router.post('/login', authControler.Login);
router.post('/register', authControler.Register);
router.post('/google', passport.authenticate('googleToken', {session: false}), authControler.GoogleOAuth)

module.exports = router;