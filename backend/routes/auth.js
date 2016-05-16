var express = require('express');
var router = express.Router();
//var users = require('../queries/users');


var db = require('../queries/users');

var promise = require('bluebird');
var crypto = require('crypto')
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/pet';
var dbb = pgp(connectionString);

///////////////////
//////passport modules/////
///////////////////
const SECRET = 'server secret';
const passport = require('passport');  
const Strategy = require('passport-local');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const authenticate = expressJwt({
  secret: SECRET
});
const TOKENTIME = 120 * 60; // in seconds


// server responses //
//////////////////////
const respond = {
  auth: function(req, res) {
    res.status(200).json({
      user: req.user,
      token: req.token
    });
  },
  token: function(req, res) {
    res.status(201).json({
      token: req.token
    });
  },
  reject: function(req, res){
    res.status(204).end();
  }
};

//////////////
// passport //
//////////////

/*
passport.use(new Strategy({
   usernameField: 'email',
   passwordField: 'password'
},
function(email, password, done) {
   db.user.authenticate(email,password,done);
}));
*/

passport.use(new Strategy(
  function(username, password, done) {
    db.user.authenticate(username, password, done);
  }
));
/*
router.get('/registrar', function(req, res) {
  res.sendfile('./views/login.html');
});
router.post('/signin', users.signin);
router.post('/login',users.login);



router.post('/login1',passport.initialize(), passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), serializeUser, generateAccessToken, respond.auth);

router.get('/me', authenticate, function(req, res) {
  res.status(200).json(req.user);
});
*/
router.post('/login2', passport.initialize(), passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), serializeUser, serializeClient, generateAccessToken,
  generateRefreshToken, respond.auth);



//////////new///
////////////
router.post('/token', validateRefreshToken, generateAccessToken,respond.token);
router.post('/token/reject', rejectToken, respond.reject);

router.get('/me', authenticate, function(req, res) {
  res.status(200).json(req.user);
});


/////////////
////helper///
/////////////



function serializeUser(req, res, next) { 
console.log("serialize"); 
  db.user.updateOrCreate(req.user, function(err, user){
    if(err) {return next(err);}
    // we store the updated information in req.user again
    req.user = {
      id: user.id
    };
    next();
  });
}

function serializeClient(req, res, next) {
  if (req.query.permanent === 'true') {
    db.client.updateOrCreate({
      user: req.user
    }, function(err, client) {
      if (err) {
        return next(err);
      }
      // we store information needed in token in req.user
      req.user.clientId = client.id;
      next();
    });
  } else {
    next();
  }
}
/*
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
}*/

function validateRefreshToken(req, res, next) {
  db.client.findUserOfToken(req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    req.user = user;
    next();
  });
}

function rejectToken(req, res, next) {
  db.client.rejectToken(req.body, next);
}






//////////////////////
// token generation //
//////////////////////
function generateAccessToken(req, res, next) {
  req.token = req.token ||  {};
  req.token.accessToken = jwt.sign({
    id: req.user.id,
    clientId: req.user.clientId
  }, SECRET, {
    expiresIn: TOKENTIME
  });
  next();
}

function generateRefreshToken(req, res, next) {
  if (req.query.permanent === 'true') {
    req.token.refreshToken = req.user.clientId.toString() + '.' + crypto.randomBytes(
      40).toString('hex');
    db.client.storeToken({
      id: req.user.clientId,
      refreshToken: req.token.refreshToken
    }, next);
  } else {
    next();
  }
}

//////////////////////






module.exports = router;
