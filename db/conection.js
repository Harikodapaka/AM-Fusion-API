var config = require('../config.json');
var mongoose = require('mongoose');

var options = { useMongoClient:true };
var db = mongoose.connect(config.connectionString, options);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;