var express = require('express')
var awsApi = require('./aws-api.js')
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usersData = {userCount:0, users:[]};

app.use(cors())
app.use(bodyParser.json())

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/getToken',(req,res) => {	
	var resp = awsApi.sts(req.body.idToken);	
	res.send(resp)	;
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