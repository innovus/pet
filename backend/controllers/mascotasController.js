"use strict"
var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/pet';
var db = pgp(connectionString);

function getMascotasAdopcion(cb){
	var queri = "select nombre_mascota,raza, edad, genero,tamaño  from mascotas natural join adopcion natural join datos_mascota ";
	console.log(queri)
	db.many(queri)
	.then(function(data){
		cb(data)
	}).catch(function(err){
		return next(err)
	})

}

function getMascotasPerdidos(cb){
	var queri = "select nombre_mascota,raza, edad, genero,tamaño  from mascotas natural join perdidos natural join datos_mascota ";
	console.log(queri)
	db.many(queri)
	.then(function(data){
		cb(data)
	}).catch(function(err){
		return next(err)
	})

}
function getMascota(id_mascota, cb){
	var queri = "select id_mascota, nombre_mascota,raza, edad, genero,tamaño, latitud, longitud, telefono, celular, email, direccion from mascotas  natural join datos_mascota where id_mascota = " + id_mascota;
	console.log(queri)
	db.many(queri)
	.then(function(data){
		cb(data,200)
	}).catch(function(err){
		return cb(err,400)
	})

}

module.exports = {
	getMascotasAdopcion: getMascotasAdopcion,
	getMascotasPerdidos: getMascotasPerdidos,
	getMascota: getMascota
}