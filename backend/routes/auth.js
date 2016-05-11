var express = require('express');
var router = express.Router();
var users = require('../queries/users');


var promise = require('bluebird');
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
const authenticate = expressJwt({
  secret: SECRET
});


//////////////
// passport //
//////////////

passport.use(new Strategy({
   usernameField: 'email',
   passwordField: 'password'
},
function(email, password, done) {
   users.db1.authenticate(email,password,done);
}));


router.get('/registrar', function(req, res) {
  res.sendfile('./views/login.html');
});
router.post('/signin', users.signin);
router.post('/login',users.login);



router.post('/login1',passport.initialize(), passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), serialize, generateToken, respond);

router.get('/me', authenticate, function(req, res) {
  res.status(200).json(req.user);
});



/////////////
////helper///
/////////////

const jwt = require('jsonwebtoken');

function serialize(req, res, next) { 
console.log("serialize"); 
  users.db1.updateOrCreate(req.user, function(err, user){
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

module.exports = router;
