var user = require('../models/user-model'),
    globalfunc = require('./globalController');
module.exports = {
    profile_get: function (req, res) {
        console.log(globalfunc.DecodeToken(req.headers.authorization))

        return res.status(200).json({
            status: true
        })
    },
    profile_update: function (req, res) {
        console.log("profile_get >>>>>>>>>>>>", req.params.id)
    }
}