var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function (req,res) {

	//Parse URL to obtain path name

	var url = parse(req.url);

	//Construct absolute path

	var path = join(root, url.pathname);

	//check for file’s existence
	fs.stat(path, function(err, stat){

		//File doesn’t exist
		if (err){
			if ('ENOENT' == err.code){
				res.statusCode = 404;
				res.end('Not Found');
				//Some other error
			} else {
				res.statusCode = 500;
				res.end('Internal Server Error');
			}
	} else {

		//Set Content-Length using stat object
		res.setHeader('Content-Length', stat.size);
		var stream = fs.createReadStream(path);
		stream.pipe(res);
		stream.on('error', function(err){
			res.statusCode = 500;
		});
	}

	});

});
