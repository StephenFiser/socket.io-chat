var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	userNames = [];

server.listen(3000);
console.log('Express and socket.io running on port 3000');

app.get('/', function(req,res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('userName', function(data, callback) {
		if (userNames.indexOf(data) != -1) { 
			callback(false);
		} else if (!socket.userName) {
			callback(true);
			userNames.push(data);
			socket.userName = data;
			console.log('Users are: ' + userNames);
			io.sockets.emit('userNames', userNames);
		} else {
			socket.emit('error', {message: 'You already have a username.'});
		}
	});
	socket.on('user message', function(data) {
		io.sockets.emit('user message', {
			userName: socket.userName,
			message: data
		});
	});
	socket.on('disconnect', function() {
		if (!socket.userName) return;
		if (userNames.indexOf(socket.userName) > -1) {
			userNames.splice(userNames.indexOf(socket.userName), 1);
		}
		console.log('Users are: ' + userNames);
		io.sockets.emit('userNames', userNames);
	});
});
