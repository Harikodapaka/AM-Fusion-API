var user = require('../models/user-model');


// Display book create form on GET
// exports.book_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Book create GET');
// };


module.exports = {
    profile_get: function (req, res) {
        console.log("profile_get >>>>>>>>>>>>",req.params.id);
    },
    profile_update: function(req, res){
        console.log("profile_get >>>>>>>>>>>>",req.params.id)
    }
}