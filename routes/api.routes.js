var express = require('express');
var router = express.Router();

// Require controller modules
var profileController = require('../controllers/profileController');

/// profile ROUTES ///

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
router.get('/profile/:id', profileController.profile_get);

/* POST request for creating Book. */
router.post('/profile/update/:id', profileController.profile_update);

/// AUTHOR ROUTES ///


/* POST request for creating Author. */
//===> router.post('/author/create', author_controller.author_create_post);

/* GET request to delete Author. */
//===> router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to update Author
//===> router.post('/author/:id/update', author_controller.author_update_post);

/* GET request for one Author. */
//===> router.get('/author/:id', author_controller.author_detail);

/* GET request for list of all Authors. */
//===> router.get('/authors', author_controller.author_list);


module.exports = router;