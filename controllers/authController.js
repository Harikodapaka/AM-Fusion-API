var express = require('express'),
    userSchema = require('../models/user-model'),
    globalfunc = require('./globalController'),
    argon2 = require('argon2');

module.exports = {
    Register: function (req, res) {
        var obj = req.body;
        if (obj.password !== obj.confirm_password) {
            res.status(409).send({
                success: false,
                message: 'Passwords did not match!!'
            })
            return;
        }
        obj.username = (obj.email).split('@')[0];
        obj.loginType = 'local'
        var query = {
            email: obj.email
        };
        console.log('register > query : ', JSON.stringify(query));
        findone(query).then(function (data) {

            if (data === null) {
                saveUserInDB(obj);
            } else {
                res.status(409).send({
                    success: false,
                    message: 'User already exist'
                })
            }
        }).catch((err) => {
            res.status(502).send({
                success: false,
                message: 'Failed to query DB'
            })
            return;
        })
        function saveUserInDB(usr) {
            var newUser = new userSchema(usr);
            globalfunc.makeHash(usr.password).then(hash => {
                newUser.password = hash;
                newUser.save(function (err, user) {
                    if (err) {
                        return res.status(502).send({
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
                return res.status(500).send({
                    success: false,
                    message: 'Internal server error',
                    error: err
                });
            })
        }
    },
    Login: function (req, res) {
        let query = { $and: [{ email: req.body.email }, { loginType: 'local' }] }
        console.log('login > query : ', JSON.stringify(query));
        findone(query, { 'username': 1, password: 1 }).then(function (respDB) {
            var user = JSON.parse(JSON.stringify(respDB));
            console.log('user found : ', user);
            if (user === null) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
                return;
            }
            if (user) {
                globalfunc.matchPassword(user.password, req.body.password).then(isMatched => {
                    if (isMatched) {
                        user.token = globalfunc.EncodeToken(user);
                        delete user['password'];
                        delete user['_id']
                        return res.status(200).json({
                            status: true,
                            user: user
                        })
                    } else {
                        return res.status(401).json({
                            status: false,
                            message: 'Invalid credentials'
                        })
                    }
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        error: err,
                        message: 'Internal server error'
                    })
                    return;
                })
            }
        }).catch((err) => {
            res.status(502).send({
                success: false,
                error: err,
                message: 'Failed to query DB'
            })
            return;
        })
    },
    GoogleOAuth: function (req, res) {
        console.log('GoogleOAuth > req.user :', JSON.stringify(req.user));
        var user = JSON.parse(JSON.stringify(req.user));
        user.token = globalfunc.EncodeToken(user);
        delete user['password'];
        delete user['_id'];
        delete user['loginType'];
        delete user['email'];
        delete user['createdAt'];
        return res.status(200).json({
            status: true,
            user: user
        })
    }
}


function findone(query, opt = {}) {
    return new Promise(function (resolve, reject) {
        userSchema.findOne(query, opt, function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })
}
