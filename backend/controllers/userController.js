"use strict"
var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/pet';
var db = pgp(connectionString);

///////////prueba/////////

///////////////



////////////////////////
/*
const userController = {
	updateOrCreateUser: function  (user, cb){
		cb(null,user);
	},
	authenticate: function(identificacion,password,cb){

		var passwordEncriptada = encriptar(identificacion,password);

		//consulto primero el usuario
		db.one("select * from usuario where identificacion = ${identificacion}",
		{
			identificacion:identificacion
		})
		.then(function(data){
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña
			db.one("select identificacion, id_usuario from usuario where identificacion = ${identificacion} and password_usuario = ${password_usuario}",
			{
				identificacion:identificacion,
				password_usuario:passwordEncriptada
			})
			.then(function(data){
				//si la contraseña coincide entra aqui
				//el data es el user  y cb es el done(null,user)
				return cb(null,data);
				//res.send("Logeado");
			}).catch(function(err){
				if(err.code == 0){
					//si la contraseña no coincide entra aqui 
					return cb(null,false,{message: 'contraseña incorrecta'});
				}else console.log(err);
			
			});
		}).catch(function(err){
			if (err.code == 0){
				return cb(null,false,{message: 'Identificacion incorrecta'});
		
			}else return cb(null,false,{message: err})
				 
		
		});
	}
};
*/

function updateOrCreateUser  (user, cb){
	cb(null,user);
}
function authenticate(email,password,cb){

		//var passwordEncriptada = encriptar(identificacion,password);

		//consulto primero el usuario
		
		var passwordEncriptada = encriptar(email,password);
		console.log(passwordEncriptada + " " + email)
		
		
		db.one("select * from users where email = ${email}",
		{
			email:email
		})
		.then(function(data){
			console.log(passwordEncriptada)
			
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña
			db.one("select email, id_user from users where email = ${email} and password = ${password}",
			{
				email:email,
				password:passwordEncriptada
			})
			.then(function(data){
				//si la contraseña coincide entra aqui
				//el data es el user  y cb es el done(null,user)
				console.log(data); 
				cb(null,data);
				//res.send("Logeado");
			}).catch(function(err){
				if(err.name == "QueryResultError"){
					console.log(err); 
					//si la contraseña no coincide entra aqui 
					return cb(null,false,{message: 'contraseña incorrecta'});
				}else console.log("prueba: " + err);
			
			});
		}).catch(function(err){
			console.log(err)
			if (err.name == "QueryResultError"){
				console.log("entro al error code cero");
				return cb(null,false,{message: 'Identificacion incorrecta'});
		
			}else return cb(null,false,{message: err})
				 
		
		});
	}

function encriptar(user, pass) {
   var crypto = require('crypto');
   // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex');
   return hmac;
}


module.exports = {
	authenticate: authenticate,
	updateOrCreateUser: updateOrCreateUser
}