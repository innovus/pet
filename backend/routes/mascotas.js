var express = require('express');
var router = express.Router();
//var users = require('../queries/users');


var authenticate = require('./auth').authenticate;

var mascotasController = require('../controllers/mascotasController');

var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
 };



router.get('/adopcion', function(req, res) {
  //console.log(req.user);
  mascotasController.getMascotas(function(data){
    res.json(data);

  })
  
});

module.exports = router;