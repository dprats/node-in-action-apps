var parse = require('url').parse;

module.exports = function route(obj) {
	return function(req, res, next){
		//Check to make sure req.method is defined
		if (!obj[req.method]) {
			next();
			//If not, invoke next() and stop any further execution
			return;
		}
		//Lookup paths for req.method
		var routes = obj[req.method];
		//Parse URL for matching against pathname
		var url = parse(req.url);
		// Store paths for req.method as array
		var paths = Object.keys(routes);

		for ( var i = 0; i < paths.length; i++){
			var path = paths[i];
			var fn = routes[path];
			path = path
				.replace(/\//g, '\\/')
    		.replace(/:(\w+)/g, '([^\\/]+)');
  		var re = new RegExp('^' + path + '$');
  		var captures = url.pathname.match(re)
  		if (captures) {
        var args = [req, res].concat(captures.slice(1));
        fn.apply(null, args);
        return;
      }
    }
    next();
  }
};