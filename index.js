var express = require('express')
var awsApi = require('./aws-api.js')
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/";
//var mongoUrl = "mongodb://botuser:canny123@cannycluster-shard-00-00-ygxmv.mongodb.net:27017,cannycluster-shard-00-01-ygxmv.mongodb.net:27017,cannycluster-shard-00-02-ygxmv.mongodb.net:27017/admin?ssl=true&replicaSet=CannyCluster-shard-0&authSource=admin"
var apiai = require('apiai');

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
app.use("/login", express.static(__dirname + '/login'));

app.post('/getToken',(req,res) => {	
	var resp = awsApi.sts(req.body.idToken);	
	res.send(resp)	;
});

io.on('connection', function(socket){
	console.log('user connected');
	var usersData = {};
	socket.emit('ARN_Alert', {sender: this.user, msg: "Kindly Enter your ARN"});
	socket.on('login', function(userData) {
		//userData = userData.toLowerCase().replace(/\s/g, "");
		if(!isADuplicate(userData)) {
			socket.emit('loggedIn', {msg: userData, users: usersData});
		} else {
			socket.emit('chooseDiffName');
		}
	})

	socket.on('logout', function() {
		disconnectUser(this);
		io.emit('botMessage', {msg: this.user+" has left the chat",  users: usersData});
	})

	socket.on('chat message', function(msg){
		var resp = request(msg);
		io.emit(resp);		
	});

	socket.on('ARN_VALUE', function(msg){
		console.log(msg);		
		if(awsApi.sts(msg.id_token,msg.ARN)){
			MongoClient.connect(mongoUrl, function(err, db) {
				if (err) throw err;
				var dbo = db.db("customer");
				var myobj = { userId: "test", ARN: msg.ARN };
				dbo.collection("customerInfo").find({ userId: "test"}).limit(1).toArray(function(err, items) {
					if (err) {
					  reject(err);
					} else {
					  console.log(items);
					  resolve(items);
					}          
				  });
				if(dbo.collection("customerInfo").find({ userId: "test"}).count()>0) {
					let data = dbo.collection("customerInfo").find({ userId: "test"}).limit(1).explain();
					console.log(data);
					socket.ARN = data.ARN;
				} else {
					dbo.collection("customerInfo").insertOne(myobj, function(err, res) {
						if (err){
							console.log(err);
							db.close();
							io.emit("OOPS Error Occurred. Please Try again");									
						}
						console.log("1 document inserted");
						db.close();
					});
				}
			});
			var resp = request("Welcome Msg");
			socket.emit(resp);
		}
		
	});

	socket.on('disconnect', function(){
		if(this.user) {
			console.log('user disconnected', this.user);
			io.emit('botMessage', {msg: this.user+" has disconnected the chat", users: usersData});
		}
	});
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

app.post('/getRunningEC2', (req,res) => {
	console.log(req.body);
	res.setHeader('Content-Type','application/json'); //Requires application/json MIME type
  	res.send(JSON.stringify({ "speech": "No Instances", "displayText": "No Instances"}))
});

var dialogflow = apiai("ba00403d4f1648a3b30f8ecc9832c6d8");
var request = function(msg){
	dialogflow.textRequest(msg, {
    	sessionId: '1234'
	}).on('response', function(response) {		
    	console.log(response);
    	return response;
	}).on('error', function(error){
		console.log(error);
		return error;
	});
}