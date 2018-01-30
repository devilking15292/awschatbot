var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usersData = {userCount:0, users:[]};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('user connected');
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function(){
        io.emit('chat message', 'user disconnected');
	});
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});