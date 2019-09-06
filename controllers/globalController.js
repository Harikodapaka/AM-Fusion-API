var config = require('../config.json'),
    jwt = require('jsonwebtoken');
module.exports = {
    EncodeToken: function (user) {
        return jwt.sign({ _id: user._id }, config.secret, { expiresIn: 18000 });
    },
    DecodeToken: function (token) {
        return jwt.verify(token.split(' ')[1], config.secret);
    }
}
