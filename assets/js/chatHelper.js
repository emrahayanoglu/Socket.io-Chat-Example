$(document).ready(function(){
	var socket = io.connect("http://localhost:8089");
	socket.on('connecting',function(){
		console.log("Socket is connecting");
	});
	socket.on('connect',function(){
		console.log("Socket is connected");
		$('#setNickname').modal('show');
	});
	socket.on('connect_failed', function(){
		console.log("Connection is failed");
	});
	socket.on('message', function(message, callback){
		console.log("A Message is received: ");
		console.log(message);
	});
	socket.on('reconnecting', function(){
		console.log("Reconnecting to Socket");
	});
	socket.on('reconnect', function(){
		console.log("Reconnection is completed");
	});
	socket.on('reconnect_failed', function(){
		console.log("Reconnection is failed");
	});
	socket.on('disconnect',function(){
		console.log("Socket is disconnected");
	});
	socket.on('chatReady',function(data){

	});
	$('#sendNicknameBtn').click(function(){
		socket.emit('setNickname',{nickname: $('#inputNickname').val()});
	});
});