var express = require('express');
var router = express.Router();
//var users = require('../queries/users');

var userController = require('../controllers/userController');


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

passport.use(new Strategy({
   usernameField: 'email',
   passwordField: 'password'
},
function(email, password, done) {
   userController.authenticate(email,password,done);
  console.log("aqui")
}));



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
*/

router.post('/login', passport.initialize(), passport.authenticate(
  'local', {
    session: false,
    scope: []
  }), serializeUser, generateAccessToken, respond.auth);




router.post('/tipo/:id', validateRefreshToken,generateAccessToken, prueba, authenticate, function(req, res) {

  dbb.one("select * from tipo where id = ${id}",
    {
      id:req.params.id
    }).then(function(data){
      res.status(200).json(data);

    }).catch(function(err){
      res.status(401).json(err);
    });
 // res.status(200).json(req.user);
});
/*
router.get('/tipo/:id', authenticate, function(req, res) {

  dbb.one("select * from tipo where id = ${id}",
    {
      id:req.params.id
    }).then(function(data){
      res.status(200).json(data);

    }).catch(function(err){
      res.status(401).json(err);
    });
 // res.status(200).json(req.user);
});
*/

/////////////
////helper///
/////////////

function prueba(req,res,next){
  
  /*req.setHeader('Authorization','Bearer '+req.token.accessToken);
  req.writeHead(200, {
  'Authorization': 'Bearer '+req.token.accessToken
});
  console.log(res)*/
  console.log("pruebita")
  next();

}


function serializeUser(req, res, next) { 
console.log("serialize"); 
  userController.updateOrCreateUser(req.user, function(err, user){
    if(err) {return next(err);}
    // we store the updated information in req.user again
    req.user = {
      id_user: user.id_user
    };
    console.log(req.user);
    next();
  });
}


function serializeClient(req, res, next) {
  
    db.db1.updateOrCreateClient({
      user: req.user
    }, function(err, client) {
      if (err) {
        return next(err);
      }
      // we store information needed in token in req.user
      req.user.cliente_id = client.id;
      console.log(req.user);
      next();
    });

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
  db.db1.findUserOfToken(req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    req.user = user;
    console.log(req.user);
    next();
  });
}

function rejectToken(req, res, next) {
  db.db1.rejectToken(req.body, next);
}


//////////////////////
// token generation //
//////////////////////
function generateAccessToken(req, res, next) {
  console.log("entro a generate acces token")
  req.token = req.token ||  {};
  req.token.accessToken = jwt.sign({
    id: req.user.id_user
  }, SECRET, {
    expiresIn: TOKENTIME
  });


  next();
}


function generateRefreshToken(req, res, next) {
  if (req.query.permanent === 'true') {
    req.token.refreshToken = req.user.cliente_id + '.' + crypto.randomBytes(
      40).toString('hex');
    db.db1.storeToken({
      id: req.user.cliente_id,
      refreshToken: req.token.refreshToken
    }, next);
  } else {
    next();
  }
}

//////////////////////


module.exports = router;
