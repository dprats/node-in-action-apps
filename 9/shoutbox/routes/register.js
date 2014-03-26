var User = require('../lib/user');

exports.form = function(req, res){
	res.render('register', {title: 'Register'});
};

//p. 213
exports.submit = function(req, res, next){
	var data = req.body.user;
	//Check if username is unique
	User.getByName(data.name, function(err, user){
		//Defer database connection errors and other errors
		if (err) return next(err);

		//redis will default it
		if (user.id){
			res.error("Username already taken");
			res.redirect('back');
		} else {
			//Create a user with POST data
			user = new User({
				name: data.name,
				pass: data.pass
			});	

			//Save new user
			user.save(function(err){
				if(err) return next(err);
				//store uid for authentication
				req.session.uid = user.id;
				//Redirect to entry listing page
				res.redirect('/');
			});	
		}
	});
};