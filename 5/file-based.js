var fs = require('fs');
var path = require('path');
//Splice out “node cli_tasks.js” to leave arguments

var args = process.argv.splice(2);

//Pull out first argument (the command)

var command = args.shift();

//Join remaining arguments

var taskDescription = args.join('');
//Resolve database path relative to 
//current working directory
var file = path.join(process.cwd(), '/.tasks');


switch (command){
	case 'list':
		listTasks(file);
		break;

	case 'add':
		addTask(file, taskDescription);
		break;

	default: 
		console.log('Usage: ' + process.argv[0] 
			+ 'list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb){
	//Check if .tasks file already exists
	console.log('calling loadOrInitializeTaskArray');
	fs.exists(file, function(exists){
		var tasks =[];
		if (exists){
				//Read to-do data from .tasks file
			fs.readFile(file, 'utf8', function(err, data) {
				if(err) throw err;
				var data = data.toString();
				var tasks = JSON.parse(data || '[]');				
				console.log(cb.toString());
				cb(tasks);
			});
		} else {
			cb([]);
		}
	});
}


function listTasks(file){
	loadOrInitializeTaskArray(file, function(tasks){
		for (var i in tasks){
			console.log(tasks[i]);
		}
	});
}

function storeTasks(file, tasks){
	console.log('calling store tasks');
	fs.writeFile(file, JSON.stringify(tasks), 'utf-8', function(err){
		if (err) throw err;
		console.log('Saved...');
	});
}

function addTask(file, taskDescription){
		console.log('calling add tasks');
		loadOrInitializeTaskArray(file, function(tasks){
			console.log('loadOrInitializeTaskArray has tasks:' + tasks);
		tasks.push(taskDescription);
		storeTasks(file, tasks);
	});

}







