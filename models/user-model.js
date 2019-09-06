var mongoose = require('mongoose'),
	shortid = require('shortid');

// User Schema
var user = mongoose.Schema({
	loginType:{
		type: String,
		enum: ['local', 'google'],
		required: true
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		required: function() { return this.loginType === 'local'; }
	},
	email: {
		type: String,
		require: true
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