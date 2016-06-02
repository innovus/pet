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

/*
module.exports = {
  user: {
    updateOrCreate: function(user, cb) {
      // db dummy, we just cb the user
      cb(null, user);
    },
    authenticate: function(username, password, cb) {
      // database dummy - find user and verify password
      if (username === 'devils name' && password === '666') {
        cb(null, {
          id: 666,
          firstname: 'devils',
          lastname: 'name',
          email: 'devil@he.ll',
          verified: true
        });
      } else {
        cb(null, false);
      }
    }
  },
  client: {
    // db dummy for clients
    clients: [],
    clientCount: 0,
    updateOrCreate: function(data, cb) {

      let id = this.clientCount++;
      this.clients[id] = {
        id: id,
        userId: data.user.id_user
      };
      cb(null, {
        id: id
      });
    },
    storeToken: function(data, cb) {
      this.clients[data.id].refreshToken = data.refreshToken;
      cb();
    },
    findUserOfToken: function(data, cb) {
      if(!data.refreshToken){
        return cb(new Error('invalid token'));
      }
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].refreshToken === data.refreshToken) {
          return cb(null, {
            id: this.clients[i].userId,
            clientId: this.clients[i].id
          });
        }
      }
      cb(new Error('not found'));
    },
    rejectToken: function(data, cb){
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].refreshToken === data.refreshToken) {
          this.clients[i] = {};
          return cb();
        }
      }
      cb(new Error('not found'));
    }
  }
};
*/

////////////////////////

const db1 = {
	updateOrCreateUser: function  (user, cb){
		cb(null,user);
	},
	authenticate: function(email,password,cb){

		var passwordEncriptada = encriptar(email,password);
		/*console.log(passwordEncriptada);
		console.log(email);*/

		//consulto primero el usuario
		db.one("select * from users where email = ${email}",
		{
			email:email
		})
		.then(function(data){
		//si entro aqui es por que  el usuario existe, y  va a revisar la contraseña
			db.one("select email, id_user from users where email = ${email} and password = ${password}",
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
				}else console.log(err);
			
			});
		}).catch(function(err){
			if (err.code == 0){
				return cb(null,false,{message: 'Email incorrecto'});
		
			}else return cb(null,false,{message: err})
				 
		
		});
	},
	updateOrCreateClient: function(data, cb) {

		db.one('insert into cliente_id(id_user) values(${id_user}) returning id',
        {id_user:data.user.id_user})
        .then(function(data){
        	return cb(null,data);
        }).catch(function(err){
        	return cb(null,false);
        });     
    },
    storeToken: function(data, cb) {

    	db.none('update cliente_id set token_refresh=${token_refresh} where id=${id}',{token_refresh:data.refreshToken,id:data.id})
    	.catch(function(err){
    		console.log("error");
    	})
      return cb();
    },
    findUserOfToken: function(data, cb) {
      if(!data.refreshToken){
        return cb(new Error('invalid token'));
      }
      //consulto primero el usuario
      db.one("select id, id_user from cliente_id where token_refresh = ${token_refresh}",
		{
			token_refresh:data.refreshToken
		})
		.then(function(data){
			console.log(data)
			cb(null,data)

		}).catch(function(err){
			return cb(new Error('not found'));

		})

    },
    rejectToken: function(data, cb){
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].refreshToken === data.refreshToken) {
          this.clients[i] = {};
          return cb();
        }
      }
      cb(new Error('not found'));
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
		db.one("select email,id_user from users where email = ${email} and password = ${password}",
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