var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

var options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./key-cert.pem')
}

var server = createServer(options, function (req,res) {
	// body...
	switch (req.method){
		case 'GET':
			show(req,res);
			break;
		case 'POST':
			upload(req, res);
			break;

	}
});

function show(req,res){
	var html = ''
		+ '<form method="post" action="/" enctype= "multipart/form-data">'
		+'<p><input type="text" name="name" /></p>'
		+'<p><input type="file" name="file" /></p>'
		+'<p><input type="submit" value="Upload" /></p>'
		+ '</form>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-length', Buffer.byteLength(html));
	res.end(html);

}

function upload(req,res){
	//upload logic
	if (!isFormData(req)){
		res.statusCode = 400;
		res.end('Bad Request: expecting multipart/form-data');
		return;
	}

	var form = new formidable.IncomingForm();

	form.on('field', function(field, value){
		console.log(field);
		console.log(value);
	});

	form.on('file', function(name, file){
		console.log(name);
		console.log(file);
	});
	form.on('end', function(){
		res.end('upload complete');
	});
	form.on('progress', function(bytesReceived, bytesExpected){
		var percent = Math.floor(bytesReceived/bytesExpected *100);
		console.log(percent);
	})

	form.parse(req);
}

function isFormData(req){
	var type = req.headers['Content-Type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}





