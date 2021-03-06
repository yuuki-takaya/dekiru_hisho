const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

const index = require('./routes/index');
const users = require('./routes/users');

const ssloptions = {
  key: fs.readFileSync('./serverKey/localhost.key', 'utf8'),
  cert: fs.readFileSync('./serverKey/localhost.crt', 'utf8')
};

mongoose.Promise = global.Promise;
const mongodbUri = 'mongodb://localhost/dekiru';
const mongOptions = {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ポート設定
app.set('httpsport', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
  res.render('error');
});


var server = https.createServer(ssloptions,app).listen(app.get('httpsport'), function(){
    console.log('Express HTTPS server listening on port ' + app.get('httpsport'));
    // mongoose.connect(mongodbUri, mongOptions);
});

module.exports = app;
