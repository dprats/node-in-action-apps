var connect = require('connect');
var app = connect()
	.use(connect.cookieParser('tobi is a cool ferret'))
	.use(function (req,res) {
		// body...
		console.log(req.cookies);
		console.log(req.signedCookies);
		res.end('hello\n');
	}).listen(3000);