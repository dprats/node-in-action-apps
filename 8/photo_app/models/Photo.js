var mongoose = require('mongoose');
//Set up connection to mongodb on 
//localhost and use photo_app as database
mongoose.connect('mongodb://localhost/photo_app');

var schema = new mongoose.Schema({
	name: String,
	path: String
});

module.exports = mongoose.model('Photo', schema);

//Mongoose provides all the CRUD methods (Photo.create, 
//Photo.update, Photo .remove, and Photo.find) on the 
//model, so you’re done.

