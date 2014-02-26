var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;



var server = http.serverCreate(function(req,res){

	var url = parse(req.url);

//Construct absolute path
	var path = join(root, url.pathname);

//Create fs.ReadStream

	var stream = fs.createReadStream(path);

//Write file data to response

	stream.on('data', function(chunk){
		res.write(chunk);
	});

//End response when file is complete
	stream.on('end', function(){
		res.end();
	});

});

server.listen(3000);