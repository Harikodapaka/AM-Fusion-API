var userSchema = require('../models/user-model'),
    globalfunc = require('./globalController');
module.exports = {
    profile_get: async function (req, res) {
        let query = { '_id': globalfunc.DecodeToken(req.headers.authorization) }
        console.log('profile_get: GET query: ', JSON.stringify(query));
        try {
            var user = await userSchema.findOne(query);
            if (user) {
                user = JSON.parse(JSON.stringify(user));
                delete user['password'];
                delete user['_id'];
                let respose = {
                    success: true,
                    user: user
                }
                res.status(200).send(respose);
            }
            return res.status(502).send({
                success: false,
                message: 'Invalid query/user not found'
            });
        } catch (err) {
            console.log('Mongo error', err)
            return res.status(500).send({
                success: false,
                error: err,
                message: 'Internal server error'
            });
        }
    },
    profile_update: async function (req, res) {
        const query = { '_id': globalfunc.DecodeToken(req.headers.authorization), 'loginType': 'local' };
        let user = { 'username': req.body.username };
        if (req.body.password || req.body.confirm_password) {
            if (req.body.password !== req.body.confirm_password) {
                console.log('passwords did not match');
                res.status(409).send({
                    success: false,
                    message: 'Passwords did not match!!'
                });
                return;
            }
            try {
                user.password = await globalfunc.makeHash(req.body.password);
            } catch (err) {
                console.log('MakeHash() error', err)
                return res.status(500).send({
                    success: false,
                    error: err,
                    message: 'Internal server error'
                });
            }
        }
        const update = {
            '$set': user
        };
        const options = { 'upsert': false };
        console.log('profile_update: query: ', JSON.stringify(query));
        console.log('profile_update: update user: ', JSON.stringify(update));
        try {
            var user_update = await userSchema.updateOne(query, update, options);
            if (user_update.nModified) {
                user_update = JSON.parse(JSON.stringify(user_update));
                let respose = {
                    success: true,
                    message: 'User updated sucessfully'
                }
                return res.status(200).send(respose);
            }
            return res.status(502).send({
                success: false,
                message: 'Invalid query/user not found'
            });
        } catch (err) {
            console.log('Mongo error', err)
            return res.status(500).send({
                success: false,
                error: err,
                message: 'Internal server error'
            });
        }
    }
}