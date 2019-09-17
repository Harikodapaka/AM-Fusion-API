var config = require('../config.json'),
    argon2 = require('argon2'),
    jwt = require('jsonwebtoken');
module.exports = {
    EncodeToken: function (user) {
        console.log(`EncodingToken for user ${user._id}`);
        return jwt.sign({ _id: user._id }, config.secret, { expiresIn: 18000 });
    },
    DecodeToken: function (token) {
        return jwt.verify(token.split(' ')[1], config.secret);
    },
    makeHash: function (password) {
        return new Promise(function (resolve, reject) {
            argon2.hash(password, {
                type: argon2.argon2d
            }).then(hash => {
                resolve(hash);
            }).catch(err => {
                return reject(err);
            })
        })

    },
    matchPassword: function (hash, password) {
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
}
