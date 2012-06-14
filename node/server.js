var io = require('socket.io').listen(8089);

console.log("Hello World");

io.configure(function(){
	io.set('transports', ['websocket', 'flashsocket']);
});

var userList = new Array();
var User = function(){
	this.id = ""
	this.nickname = ""
};

io.sockets.on('connection', function(socket){
	console.log("A user is connected");
	socket.on('message',function(data){
		console.log("A new message is received");
	});
	socket.on('setNickname',function(data){
		console.log("Data is: " + data.nickname);
		var newUser = new User();
		newUser.id = socket.id;
		newUser.nickname = data.nickname;

		userList.push(newUser);

		console.log(userList);
	});
	socket.on('disconnect',function(){
		console.log("User is disconnected");
	});
});