

// page 196
//require Photo Model
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
// //Reference path.join so you can name variables “path
var join = path.join;
//end page 196

// New exports.list from p. 197

exports.list = function(req, res, next){
	Photo.find({}, function(err, photos){
		if (err) return next(err);
		res.render('Photos', {
			title: 'Photos',
			photos: photos
		});
	});
};

exports.form = function(req,res){
	res.render('photos/upload', {
		title: 'Photo upload'
	});
};

// page 196

exports.submit =function(dir){
	return function(req, res, next){
		//default to original filename
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name;
		var path = join(dir, img.name);

		//rename file
		fs.rename(img.path, path, function(err){
			if(err) return next(err);

			Photo.create({
				name: name,
				path: img.name
			}, function (err){
				if(err) return next(err);
				//perform HTTP redirect to index page
				res.redirect('/');
			});
		});
	};
};

// page 199

// exports.download = function(dir){
// 	return function(req, res, next){
// 		var id = req.params.id;
// 		Photo.findById(id, function(err, photo){
// 			if (err) return next(err);
// 			var path = join(dir, photo.path);
// 			// res.sendfile(path);
// 			res.download(path, photo.name+'.jpeg');
// 		});
// 	};
// };

exports.download = function(dir){
  return function(req, res, next){
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
      res.download(path, photo.name+'.jpeg');
    });
  };
};













