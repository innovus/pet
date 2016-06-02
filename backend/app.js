// start with node authentication/refreshTokenScenario.js
//'use strict';

//////////////
///configuration///
/////////////////


const PORT = 3000;
const SECRET = 'server secret';
const TOKENTIME = 120 * 60;


////////////
////modules///
//////////////
var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');

var users = require('./routes/auth');
var mascotas = require('./routes/mascotas');


/*
////////
const http = require('http');
//var passport = require('./views/passport');
const passport = require('passport');  
const Strategy = require('passport-local');
const expressJwt = require('express-jwt');
const authenticate = expressJwt({
  secret: SECRET
});
*/
/////////////////
///////db dummy solo para el amage

/*
const db = {  

  updateOrCreate: function(user, cb){
    // db dummy, we just cb the user
    cb(null, user);
  },
  authenticate: function(email,password, cb){
    // database dummy - find user and verify password
    if(email === 'devil@he.ll' && password === '666'){
      cb(null, {
        id_user: 66,
        firstname: 'devils',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true
      });
    }
    else {
      cb(null, false);
    }
  }
};
*/



var app = express();


//////////////
// passport //
//////////////
/*
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},  
function(email, password, done) {
    db.authenticate(email,password,done);
  }));
*/

// view engine setup
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

////////////
// server //
////////////
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
*/

/////////////
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use('/auth',users );
app.use('/mascotas',mascotas);

app.get('/', function(req, res) {
  res.status(200).json({
    hello: 'world'
  });
});
/*
app.post('/authi', passport.initialize(), passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), serialize, generateToken, respond);
*/



/*http.createServer(app).listen(PORT, function() {
  console.log('server listening on port ', PORT);
});*/
app.listen(PORT, function(){
  console.log('Servidor iniciado con express. Escuchando el puerto 3000')
})
///helper//


/*

const jwt = require('jsonwebtoken');

function serialize(req, res, next) { 
console.log("serialize"); 
  db.updateOrCreate(req.user, function(err, user){
    if(err) {return next(err);}
    // we store the updated information in req.user again
    req.user = {
      id: user.id_user
    };
    next();
  });
}
function generateToken(req, res, next) { 
console.log("generateToken"); 
  req.token = jwt.sign({
    id: req.user.id_user,
  }, 'server secret', {
    expiresIn: 120
  });
  next();
}

function respond(req, res) {  
  console.log("respond");
  res.status(200).json({
    user: req.user,
    token: req.token
  });
}
*/


/*
app.listen(3000, function(){
  console.log('Servidor iniciado con express. Escuchando el puerto 3000')
})*/


module.exports = app;
