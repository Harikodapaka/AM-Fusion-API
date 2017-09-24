var express = require("express"),
    router = express.Router(),
    user = require("../models/user-model"),
    bcrypt = require('bcryptjs');


router.post("/", function (req, res) {
    var obj = req.body;
    var query = {
        username: obj.username
    };
    user.findOne(query, function (err, data) {

        if (data != null) {
            // res.status(500).send({ error: err });
            res.send({
                success: false,
                message: 'User already exist!'
            })
            return;
        } else {

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    obj.password = hash;
                    var model = new user(obj);
                    model.save(function (err) {
                        if (err) {
                            res.send({
                                "error": err
                            });
                            return;
                        }
                        res.status(500).send({
                            success: true,
                            user: obj
                        });
                    });
                });
            });

        }
    })

})
module.exports = router;