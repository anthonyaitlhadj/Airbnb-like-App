var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var bookings = require('./routes/bookings');
var houses = require('./routes/houses');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:5Vn8XEOBGfSBVE1q@cluster0-shard-00-00-uckpb.mongodb.net:27017,cluster0-shard-00-01-uckpb.mongodb.net:27017,cluster0-shard-00-02-uckpb.mongodb.net:27017/airbnb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', function(err) {
  if (err) { throw err; }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use('/users', users);
app.use('/bookings', bookings);
app.use('/houses', houses);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({'error': res.locals.message, 'info' : res.locals.error});
});

module.exports = app;
