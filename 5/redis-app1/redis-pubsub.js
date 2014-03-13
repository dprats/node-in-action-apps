var net = require('net');
var redis = require('redis');
//Define setup logic for each user connecting to chat server

console.log('about to call server');

var server = net.createServer(function(socket){
	var publisher;
	var subscriber;
console.log('someone connected');
	socket.on('connect', function(){
		console.log('someone connected');
		//Create subscriber client for each user
		subscriber = redis.createClient();
		//Subscribe to a channel
		subscriber.subscribe('main_chat_room');
		//When a message is received from a channel, show it to user
		subscriber.on('message', function(channel, message){
			socket.write('Channel' + channel + ': ' + message);
		});
		//Create publisher client for each user
		publisher = redis.createClient();
	});

	//When user enters a message, publish it
	socket.on('data', function(data){
		publisher.publish('main_chat_room', data);
	});

	socket.on('end', function(){
		subscriber.unsubscribe('main_chat_room');
		//If user disconnects, end client connections
		subscriber.end();
	});
});

server.listen(3000);