var http = require('http');

server = http.createServer( function(req,res){
	res.write('Hello world');
	res.end();
});

server.listen(3000);
