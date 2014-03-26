var express = require('express');

//prototype that Express uses for the response objects
//Adding properties to this object means they’ll 
//then be available to all middleware and routes alike.
var res = express.response;

//The res.message function provides a way to add 
//messages to a session variable from
//any Express request. 

res.message = function(msg, type){
	type = type || 'info';
	var sess = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push( {type: type, string: msg });
};



//allows you to easily add a message of type error 
//to the message queue
res.error = function(msg){
	return this.message(msg, 'error');
};

//expose these messages to the templates for output.
//If you don’t do this, you’d have to pass 
//req.session.messages to every res.render() call

module.exports = function(req, res, next){
	// template variable is defined to store the session’s messages
	res.locals.messages = req.session.messages || [];
	//way to remove the messages from the session
	res.locals.removeMessages = function(){
		req.session.messages =[];
	};
	next();
};






