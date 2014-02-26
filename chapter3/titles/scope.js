function asyncFunction(callback){
	setTimeout(callback, 200);
}

var color = 'blue';

(function (color) {
	asyncFunction(function() {
		console.log('color is ' + color);
	})
})(color);

color = 'green';