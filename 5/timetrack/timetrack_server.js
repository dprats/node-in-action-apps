var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

var db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'myuser',
	password: 'mypassword',
	database: 'timetrack'
});

//The application allows you to 
//browse, add, and delete work performance 
//records.

var server = http.createServer(function(req,res){
	switch (req.method){
		case 'POST':
			switch (req.url){
				case '/':
					work.add(db, req, res);
					break;
				case '/archive':
					work.archive(db, req, res);
					break;
				case '/delete':
					work.delete(db, req, res);
					break;
			}
			break;

		case 'GET':
			switch(req.url){
				case '/':
					work.show(db, req);
					break;
				case '/archived':
					work.showArchived(db, req);
					
			}
			break;
	}
});

//This logic creates a database table if none exists and 
//starts the HTTP server listening to IP address 127.0.0.1 
//on TCP/IP port 3000. 

db.query(
	//Table-creation SQL
	"CREATE TABLE IF NOT EXISTS work("
	+ "id INT(10) NOT NULL AUTO_INCREMENT"
	+ "hours DECIMAL(5,2) DEFAULT 0"
	+ "date DATE"
	+ "archived INT(1) DEFAULT 0"
	+ "description LONGTEXT"
	+ "PRIMARY KEY(id))", 
	function(err){
		if (err) throw err;
		console.log('Server started...');
		//Start HTTP server
		server.listen(3000, '127.0.0.1');
	}
)







