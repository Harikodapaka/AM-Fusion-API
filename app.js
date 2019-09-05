var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var cors = require('cors');

// App
var config = require('./config.json')
var connection = require('./db/conection')
var apiRoutes = require('./routes/api.routes');
var auth = require('./routes/auth.routes');

// Init App
var app = express();

var allowedOrigins = ['http://localhost:4200',
                      'https://amfusion.netlify.com'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
}).unless({ path: ['/auth/register','/auth/login'] }));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api', apiRoutes);

app.use('/auth', auth);


// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        var resp = {success:false,statusCode:401};
        resp[err.name]=err.message;
      res.status(401);
      res.json(resp);
    }
  });
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });
  
// Set Port
var server = app.listen(process.env.PORT || config.port, function () {
    console.log('Server listening at http://localhost'+ ':' + server.address().port);
});