var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var config = require('./config.json')
var connection = require('./db/conection')
var apiRoutes = require('./routes/api.routes');
var auth = require('./routes/auth.routes');

// Init App
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes);
app.use('/auth', auth);

// Set Port
var server = app.listen(config.port, function () {
    console.log('Server listening at http://localhost'+ ':' + server.address().port);
});