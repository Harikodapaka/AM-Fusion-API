var mongoose = require('mongoose'),
	shortid = require('shortid');

// User Schema
var user = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		require:true
	},
	email: {
		type: String,
		require:true
	},
	name: {
		type: String
	},
	token: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	_id: {
		type: String,
		'default': shortid.generate
	},
}, {
    versionKey: false
})

var User = module.exports = mongoose.model('user', user);