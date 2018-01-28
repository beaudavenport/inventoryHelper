// Inventory Helper main application js file
//
//

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db');
var v1Routes = require('./routes/index');
var v2Routes = require('./routes/v2Routes');
var inventory = require('./routes/inventory');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// jwt setup
app.set('jwtTokenSecret', process.env.jwtString);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  req.db = db;
  req.app = app;
  next();
});

// define routes
app.use('/:version/inventory', inventory);
app.use('/v2', v2Routes);
app.use('/v1', v1Routes);

//default
app.use('/*', function(req, res) {
  res.redirect('/v2');
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
