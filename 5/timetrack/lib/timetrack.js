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
	//parse HTTP data
	exports.parseReceivedData(req, function(work){
		db.query(
			//SQL to archive the data
			"UPDATE work SET archived=1 where id=?",
			[work.id],
			function(err){
				if (err) throw err;
				//show user a list of work records
				exports.show(db, res);
			}
			);
	});
};

//function to delete work

exports.delete = function(db, req, res){

	exports.parseReceivedData(req, function(work){
		db.query(
			//SQL to delete the work
			"DELETE FROM work WHERE id =?",
			[work.id],
			function(err){
				if(err) throw err;
				//show user a list of work records
				exports.show(db, res);
			}
			);
	});
};

exports.show = function(db, res, showArchived){

//SQL to fetch work records
	var query = "SELECT * FROM work " +
							"WHERE archived=?" +
							"ORDER BY date esc";

	var archiveValue =(showArchived) ? 1 : 0;
		db.query(
			//SQL to show a particular work
			query, 
			[archiveValue],
			function(err, rows){
				if(err) throw err;
				html = (showArchived)
				? ''
				: '<a href="/archived">Archived work</a><br/>';
				//Format results as HTML table
				html += exports.workHitListHtml(rows);
				html += exports.workFormHtml(rows);
				//Send HTML response to user
				exports.sendHTML(res, html);
			}
		);
};

exports.showArchived =function(db, res){
	//Show only archived work records
	exports.show(db, res, true);
};




//rendering of work records to HTML.

exports.workHitListHtml = function(rows){
	var html = '<table>';
	//Render each work record as HTML table row
	for (var i in rows){
		html += '<tr>'
		html += '<td>' + rows[i].date + '</td>';
		html += '<td>' + rows[i].hours + '</td>';
		html += '<td>' + rows[i].description + '</td>';
		//show archive button if work record isn’t already archived
		if(!rows[i].archived){
			html +='<td>' + exports.workArchiveForm(rows[i].id) +'</td>';
		}
		html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
		html += '<tr>';
	}
	html +='</table>';
	return html;
};

//render the HTML forms needed by the application.

exports.workFormHtml = function(){
	var html = '<form method="POST" action="/">' +
							'<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"></p>'+
							'<p>Hours worked:<br/><input name="hours" type="text"></p>' +
							'<p>Description:<br/>'+
							'<textarea name="description"></textarea></p>' +
							'<input type="submit" value= "Add" />' +
							'</form>';
	return html;
};

exports.workArchiveForm = function(id){
	return exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteForm = function(id){
	return exports.actionForm(id, '/delete', 'Delete');
};







