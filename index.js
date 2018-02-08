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

app.use("/lib", express.static(__dirname + '/lib'));
app.use("/app", express.static(__dirname + '/app'));
app.use("/style", express.static(__dirname + '/style'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/fonts", express.static(__dirname + '/fonts'));

app.post('/getToken',(req,res) => {	
	var resp = awsApi.sts(req.body.idToken);	
	res.send(resp)	;
});

io.on('connection', function(socket){
	console.log('user connected');
	var usersData = {};
	socket.on('login', function(userData) {
		//userData = userData.toLowerCase().replace(/\s/g, "");
		if(!isADuplicate(userData)) {
			//usersData.userCount++;
			//console.log('logginIn', userData);
			//socket.user = userData;
			//usersData.users.push(userData);
			socket.emit('loggedIn', {msg: userData, users: usersData});
			io.emit('botMessage', {msg: this.user+" has entered the chat", users: usersData});
			//setTimer(this);
		} else {
			this.emit('chooseDiffName');
		}
		//console.log('timer', this.timer);
	})

	socket.on('logout', function() {
		//disconnectUser(this);
		io.emit('botMessage', {msg: this.user+" has left the chat",  users: usersData});
		//clearTimer(this.timer);
	})

	socket.on('chat message', function(msg){
		//if(this.user==null) {
		//	socket.emit('fakeLog');
		//}
		//console.log(this.user);
		io.emit('chat message', {sender: this.user, msg: msg});
		//refreshTimer(this);
		//console.log(this.timer);
	});

	socket.on('disconnect', function(){
		if(this.user) {
			console.log('user disconnected', this.user);
			//removeUser(this);
			io.emit('botMessage', {msg: this.user+" has disconnected the chat", users: usersData});
			//clearTimer(this.timer);
		}
	});
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});