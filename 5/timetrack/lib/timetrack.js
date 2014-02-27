// Inside this file, insert the logic from 
//listing 5.10, which includes the Node 
//querystring API and defines helper functions 
//for sending web page HTML and receiving data 
//submitted through forms.

var qs = require('querystring');

//send HTML response

exports.sendHTML = function(res,html){
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-length', Buffer.byteLength(html));
	res.end(html);
};

//receiving data submitted through forms part 1

//parse HTTP POST data
exports.parseReceivedData = function(req, cb){
	var body ='';
	req.setEncoding('utf-8');
	//collect all the data and place in body
	req.on('data', function(chunk) {body += chunk;});
	//once body is all collected..
	req.on('end', function(){
		//parse the body using query string API
		var data = qs.parse(body);
		//pass body to the callback
		cb(data);
	});
};

//render simple form

exports.actionForm = function(id, path, label){

	var html = '<form method="POST" action="'+ path + '"/> '
						+'<input type="hidden" name="id" value="' + id + '"/>'
						+'<input type="submit" value="' +label+'"/>'
						+ '</form>';
	return html;

};

//function to add work

exports.add = function(db, req, res){

	//Parse HTTP POST data
	exports.parseReceivedData(req, function(data){
		db.query(
			//SQL to add work record
			"INSERT INTO work (hours, date, description) " +
			" VALUES (? , ? , ?",
				//Work record data
				[work.hours, work.date, work.description],
				function(err){
					if(err) throw err;
					//Show user a list of work records
					exports.show(db, res);
				}
			);
	});

};

exports.archive= function(db, req, res){

};

//function to delete work

exports.delete = function(db, req, res){

};

exports.show = function(db, req){

};

exports.showArchived =function(db, req){

};