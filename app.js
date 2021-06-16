var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
var logger = require('morgan');
require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const webconf = require('./config/web-config');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });
const hbsSetup = require('./config/hbs-setup')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true, useCreateIndex : true, useUnifiedTopology : true}, () => {
    console.log('\x1b[33m%s\x1b[0m', 'connected to mongodb');
});

app.use(function(req,res,next){
  res.locals.webconf = webconf;
  next();
});

app.use((req,res,next) => { //log session
  // res.cookie("nama", "dudung",{httpOnly: true})
  // console.log({user: req.user,cookie: req.session});
  next();
});

app.use('/x', require('./routes/ajax.js'));
app.use('/file', require('./routes/file.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/u', require('./routes/users.js'));
app.use('/w', require('./routes/workspace.js'));
app.use('/p', require('./routes/profile.js'));
app.use('/:workspace', require('./routes/workspace-page.js'))
app.use('/', require('./routes/index.js'));                 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //console.log('error catched');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {layout: 'layouts/error'});
});

module.exports = app;
