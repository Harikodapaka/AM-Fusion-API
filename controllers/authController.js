var express = require("express"),
    router = express.Router(),
    userSchema = require("../models/user-model"),
    config = require('../config.json'),
    jwt = require('jsonwebtoken'),
    argon2 = require('argon2');

router.post("/register", function (req, res) {
    var obj = req.body;
    obj.username = (obj.email).split('@')[0];
    var query = {
        email: obj.email
    };
    console.log("register > query : ", query);
    findone(query).then(function (data) {

        if (data === null) {
            saveUserInDB(obj);
        } else {
            res.send({
                success: false,
                message: 'User already exist'
            })
        }
    }).catch((err) => {
        res.send({
            success: false,
            message: 'Failed to query DB'
        })
        return;
    })
    function saveUserInDB(usr) {
        var newUser = new userSchema(usr);
        makeHash(usr.password).then(hash => {
            newUser.password = hash;
            newUser.save(function (err, user) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        success: true,
                        message: 'User created successfully'
                    });
                }
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: 'Internal server error',
                error: err
            });
        })
    }

}).post('/login', function (req, res) {
    let query = {
        email: req.body.email
    }
    console.log("login > query : ", query);
    findone(query, {'username': 1, password: 1}).then(function (respDB) {
        var user = JSON.parse(JSON.stringify(respDB));
        console.log("user found : ", user);
        if (user === null) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found'
            });
            return;
        }
        if (user) {
            matchPassword(user.password, req.body.password).then(isMatched => {
                if (isMatched) {
                    user.token = jwt.sign({ email: user.email, _id: user._id }, 'RESTFULAPIs');
                    delete user['password'];
                    return res.status(200).json({
                        status: true,
                        user: user
                    })
                } else {
                    return res.status(401).json({
                        status: false,
                        message: "Invalid credentials"
                    })
                }
            }).catch((err) => {
                res.send({
                    success: false,
                    error: err,
                    message: 'Internal server error'
                })
                return;
            })
        }
    }).catch((err) => {
        res.send({
            success: false,
            error: err,
            message: 'Failed to query DB'
        })
        return;
    })
})

function findone(query, opt = {}) {
    return new Promise(function (resolve, reject) {
        userSchema.findOne(query,opt , function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })
}
function matchPassword(hash, password) {
    return new Promise(function (resolve, reject) {
        argon2.verify(hash, password).then(match => {
            if (match) {
                resolve(match);
            } else {
                resolve(match);
            }
        }).catch(err => {
            reject(err)
        });
    })
}
function makeHash(password) {
    return new Promise(function (resolve, reject) {
        argon2.hash(password, {
            type: argon2.argon2d
        }).then(hash => {
            resolve(hash);
        }).catch(err => {
            return reject(err);
        })
    })

}
module.exports = router;