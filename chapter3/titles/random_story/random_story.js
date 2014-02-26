var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';


//Task 1: Make sure file containing the list of RSS feed URLs exists.

function checkForRSSFile(){
	console.log('calling check for RSSfile');
	fs.exists(configFilename, function(exists){
		if (!exists){
			return next(new Error('Missing RSS file:' + configFilename));
		}
		next(null, configFilename);
	})
}


//Task 2: Read and parse file containing the feed URLs.

function readRSSFile(){
	console.log('calling readRSSfile');
	
	fs.readFile(configFilename, function(err, feedList){

	if(err) return next(err);

//Convert list of feed URLs to a string and then into an array of feed URLs.
	feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");

//Select random feed URL from array of feed URLs.
	var random = Math.floor(Math.random()*feedList.length);
	next(null, feedList[random]);
	});
}

//do an HTTP request and get data for the selected feed

function downloadRSSfile(feedUrl){

	console.log('calling downloadRSSfile');

	request({uri: feedUrl}, function(err,res, body){
		if (err) return next(err);
		if(res.statusCode !=200)
			return next(new Error('Abnormal response status code'))
		next(null,body);
	});
}

//Parse RSS data into array of items.

function parseRSSFeed(res){

	console.log('calling parse RSSfile');
	var handler = new htmlparser.RssHandler();
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(res);

	if (!handler.dom.items.length)
		return next(new Error('no RSS item found'));
	var item =handler.dom.items.shift();
	console.log(item.title);
	console.log(item.link);

}

var tasks = [ checkForRSSFile,
							readRSSFile,
							downloadRSSfile,
							parseRSSFeed];

function next(err, result){

		console.log('calling next');

	//throw exception if task encounters an error.
	if (err) throw err;
	//if (err) throw err;

//Next task comes from array of tasks.
	var currentTask = tasks.shift();
//Execute current task.
	if (currentTask){
		currentTask(result);
	}
}


next();







