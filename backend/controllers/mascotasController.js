"use strict"
var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/pet';
var db = pgp(connectionString);

function getMascotas(cb){
	var queri = "select nombre_mascota,raza, edad, genero,tamaño  from mascotas natural join adopcion natural join datos_mascota ";
	console.log(queri)
	db.many(queri)
	.then(function(data){
		cb(data)
	}).catch(function(err){
		return next(err)
	})

}
module.exports = {
	getMascotas: getMascotas
}