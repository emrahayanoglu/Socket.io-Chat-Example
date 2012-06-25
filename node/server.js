var io = require('socket.io').listen(8089);

console.log("Hello World");

io.configure(function(){
	io.set('transports', ['websocket', 'flashsocket']);
});

var userList = new Array();
var User = function(){
	this.id = "";
	this.nickname = "";
	this.toString = function(){
		return "User: ID:" + this.id + " Nickname: " + this.nickname;
	};
};
var findUser = function(userArray,id){
	var user = null;
	for(var i = 0; i < userArray.length; i++){
		if(userArray[i].id == id){
			user = userArray[i];
		}
	}
	return user;
};
var sendToOthers = function(userArray,id,nickname,msg){
	for(var i = 0; i < userArray.length; i++){
		if(userArray[i].id != id){
			console.log(id);
			io.sockets.sockets[userArray[i].id].json.send({type:5,chatMsg:msg,sender:nickname});
		}
	}
};

io.sockets.on('connection', function(socket){
	console.log("A user is connected");
	socket.on('message',function(data){
		var user = findUser(userList,socket.id);
		if(user != null){
			console.log("A message is received: " + data);
			console.log("Message received from: " + user.toString());
			sendToOthers(userList,user.id,user.nickname,data);
		}
	});
	socket.on('setNickname',function(data){
		console.log("Data is: " + data.nickname);
		var newUser = new User();
		newUser.id = socket.id;
		newUser.nickname = data.nickname;

		userList.push(newUser);

		console.log(userList);

		socket.json.send({type:10,msg:"Nickname setting is finished"});
	});
	socket.on('sendChat',function(data){
		var user = findUser(userList,socket.id);
		if(user != null){
			console.log("A message is received: " + data);
			console.log("Message received from: " + user.toString());
			sendToOthers(userList,user.id,user.nickname,data);
		}
	});
	socket.on('disconnect',function(){
		console.log("User is disconnected");
	});
});