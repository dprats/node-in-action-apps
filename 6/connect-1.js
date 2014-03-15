var connect = require('connect');

function logger(req, res, next){
	console.log('%s %s', req.method, req.url);
}

function hello(req, res){
	res.setHeader('Content-type', 'text/plain');
	console.log('Hello world');
}

var app = connect();
app.use(logger);
app.use(hello);
app.listen(3000);