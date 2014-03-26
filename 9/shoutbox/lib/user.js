var redis = require('redis');
var bcrypt = require('bcrypt');
//Redis connection is opened with redis.createClient()
var db = redis.createClient();

//The User function accepts an object and 
//merges this object’s properties into its own.

module.exports = User;

function User(obj){
	for (var key in obj){
		this[key] = obj[key];
	}
}

//Saving a user to Redis p.205

//The save() method shown checks if the user 
//already has an ID, and if so it invokes the 
//update() method, indexing the user ID by name, 
//and populating a Redis hash with the object’s 
//properties.

User.prototype.save = function(fn){
	//user already exists
	if (this.id){
		this.update(fn);
	} else {
		var user = this;
		//Create unique ID
		db.incr('user:ids', function(err, id){
			if (err) return fn(err);
			//Set ID so it’ll be saved
			user.id = id;
			//hash password
			user.hashPassword(function(err){
				if (err) return fn(err);
				//save user proprerties
				user.update(fn);
			});
		});
	}
};

User.prototype.update = function(fn){
	var user = this;
	var id = user.id;
	//Index user ID by name
	db.set('user:id:' + user.name, id, function(err){
		if (err) return fn(err);
		//Use Redis hash to store data
		db.hmset('user:' + id, user, function(err){
			fn(err);
		});
	});
};

User.prototype.hashPassword = function(fn){
	var user = this;
	//Generate a 12-character salt
	bcrypt.genSalt(12, function(err, salt){
		if (err) return fn(err);
		//Set salt so it’ll be saved
		user.salt = salt;
		bcrypt.hash(user.pass, salt, function(err, hash){
			if (err) return fn(err);
			//Set hash so it’ll be saved
			user.pass = hash;
			fn();
		});
	});
};

// // //create new user for p. 207
var tobi = new User({
	name: 'Tobi',
	pass: 'im a ferret',
	age: '2'
});


// // //save user
tobi.save(function(err){
	if (err) throw err;
	console.log('user id %d', tobi.id);
});

//p.208

// User.getByName = function(name, fn){
// 	//Look up user ID by name
// 	User.getId(name, function(err, fn){
// 		if (err) return fn(err);
// 		//grab the user with the ID
// 		User.get(id, fn);
// 	});
// };

// //p.208
// User.getId = function(name, fn){
// 	//call Redis to return ID of the user with name X
// 	db.get('user:id:' + name, fn);
// };
// //p.208
// //get the Redis hash data for user with ID X
// User.get = function(id, fn){
// 	//Fetch plain- object hash
// 	db.hgetall('user:' +id, function(err, user){
// 		if (err) return fn(err);
// 		//Convert plain object to a new User object
// 		fn(null, new User(user));
// 	});
// };

// //authenticating user name and password

// User.authenticate = function(name, pass, fn){
// 	//Look up user by name
// 	User.getByName(name, function(err, user){
// 		//if error
// 		if(err) return fn(err);
// 		//if User doesn’t exist
// 		if (!user.id) return fn();
// 		//hash given password
// 		bcrypt.hash(password, user.salt, function(err, hash){
// 			if (err) return fn(err);
// 			//match found
// 			if (hash == user.pass) return fn (null, user);
// 			//invalid password
// 			fn();
// 		});
// 	});
// };




