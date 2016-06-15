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
  mascotasController.getMascotasAdopcion(function(data){
    res.json(data);

  })
  
});

router.get('/perdidos', function(req, res) {
  //console.log(req.user);
  mascotasController.getMascotasPerdidos(function(data){
    res.json(data);

  })
  
});

router.get('/:id_mascota', function(req, res) {
  //console.log(req.user);
  mascotasController.getMascota(req.params.id_mascota,function(data,status){
  	if(status == 200){
  		res.status(200).json(data);

  	}else if (status == 400){
  		res.status(400).json(data);

  	}
    

  })
  
});

module.exports = router;