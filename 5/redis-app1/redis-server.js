var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function(err){
	console.log('Error ' + err);
});

//he print function prints the results of an 
//operation or an error if one occurs.
client.set('color', 'red', redis.print);
client.get('color', function(err, value){
	if(err) throw err;
	console.log('Got: ' + value);
});

//The hmset Redis command sets hash table 
//elements, identified by a key, to a value.

client.hmset('camping', {
	'shelter': '2-person tent',
	'cooking': 'campstove'
}, redis.print);

//Get “cooking” element’s value
client.hget('camping', 'cooking', function(err, value){
	if (err) throw err;
	console.log('Will be cooing with: ' + value);
});

//Get hash table keys

client.hkeys('camping', function(err, keys){
	if(err) throw err;
	keys.forEach(function(key){
		console.log(' ' + key);
	});
});


client.lpush('tasks', 'Paint the bike red', redis.print);
client.lpush('tasks', 'Paint the bike green', redis.print);
client.lrange('tasks', 0, -1, function(err, items){
	if (err) throw err;
	items.forEach(function(item, i){
		console.log(' ' +  item);
	});
});


//The following code illustrates the storage and 
//retrieval of IP addresses. 

client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.86', redis.print);
client.smembers('ip_addresses', function(err, members){
	if(err) throw err;
	console.log(members);
})















