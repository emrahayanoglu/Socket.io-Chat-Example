var io = require('socket.io').listen(8089);

io.configure(function(){
	io.set('transports', ['websocket', 'flashsocket']);
});

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

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
var sendToAll = function(userArray,nickname,msg,typeValue){
	for(var i = 0;i < userArray.length; i++){
		io.sockets.sockets[userArray[i].id].json.send({type:typeValue,chatMsg:msg,sender:nickname});
	}
};
var removeUser = function(userArray,user){
	for(var i = 0;i < userArray.length; i++){
		if(userArray[i].id === user.id){
			userArray.remove(i);
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
		sendToAll(userList,newUser.nickname,userList,11);
	});
	socket.on('sendChat',function(data){
		var user = findUser(userList,socket.id);
		if(user != null){
			console.log("A message is received: " + data);
			console.log("Message received from: " + user.toString());
			sendToAll(userList,user.nickname,data.chatMsg,5);
		}
	});
	socket.on('disconnect',function(){
		console.log("User is disconnected");
		//Disconnect from server
		var user = findUser(userList,socket.id);
		removeUser(userList,user);
		sendToAll(userList,"",userList,11);
	});
});