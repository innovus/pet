var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/pet';
var db = pgp(connectionString);

const db1 = {
	updateOrCreate: function  (user, cb){
		cb(null,user);
	},
	authenticate: function(email,password,cb){

		var passwordEncriptada = encriptar(email,password);
		//consulto primero el usuario
		db.one("select * from users where email = ${email}",
		{
			email:email
		})
		.then(function(data){
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña
			db.one("select email, token_refresh, id_user from users where email = ${email} and password = ${password}",
			{
				email:email,
				password:passwordEncriptada
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
				}else return next(err);
			
			});
		}).catch(function(err){
			if (err.code == 0){
				return cb(null,false,{message: 'Email incorrecto'});
		
			}else return next(err);
				 
		
		});
	}
};




function encriptar(user, pass) {
   var crypto = require('crypto');
   // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex');
   return hmac;
}

function login(req, res,next){
	var emaili = req.body.email;
	var passwordi = req.body.password;
	var passwordEncriptada = encriptar(emaili,passwordi);

//consulto primero el usuario
	db.one("select * from users where email = ${email}",
		{
			email:emaili
		})
	.then(function(data){
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña
		db.one("select email,token_refresh,id_user from users where email = ${email} and password = ${password}",
		{
			email:emaili,
			password:passwordEncriptada
		})
		.then(function(data){
			//si la contraseña coincide entra aqui
			
			res.send(data);
		}).catch(function(err){
			if(err.code == 0){
				//si la contraseña no coincide entra aqui 
				res.send("Error Password");
			}else return next(err);
			
		});
		

	}).catch(function(err){
		if (err.code == 0){
			res.send("usuario no existe");
		
		}else return next(err);
		
		 
		
	});
}

function signin(req, res,next){
	var email = req.body.email;
	var password = req.body.password;
	var passwordEncriptada = encriptar(email,password);
	db.one("select * from users where email = ${email}",
		{
			email:email
		})
	.then(function(data){
		res.send("el usuario ya existe");
	}).catch(function(err){

		if (err.code == 0){
			var queri = "insert into users(email,password) values ('"+email+"','"+passwordEncriptada+"')";
			 console.log(queri)
			//si entra qui el usuario no existe
			/*db.none('insert into users(email,password) values ${email},${this^}',
				{
					email:email,
					passwordEncriptada:passwordEncriptada
				})*/
			db.none(queri)
			.then(function(data){
				res.send("insertado")

			}).catch(function(err){
				return next(err);
			});
						
		}else return next(err);

	})
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña

}




module.exports = {
	login: login,
	signin: signin,
	db1: db1
}