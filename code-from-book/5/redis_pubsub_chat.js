var net = require('net');
var redis = require('redis');

console.log('about to call server');

var server = net.createServer(function(socket) {
  var subscriber;
  var publisher;
  console.log('about to connect');
  socket.on('connect', function() {
    console.log('someone connected');
    subscriber = redis.createClient(6379, 'localhost');
    subscriber.subscribe('main_chat_room');

    subscriber.on('message', function(channel, message) {
      socket.write('Channel ' + channel + ': ' + message);
    });

    publisher = redis.createClient(6379, 'localhost');
  });

  socket.on('data', function(data) {
    console.log('data');
    publisher.publish('main_chat_room', data);
  });

  socket.on('end', function() {
    console.log('end');
    subscriber.unsubscribe('main_chat_room');
    subscriber.end();
    publisher.end();
  });
});

server.listen(3000);
