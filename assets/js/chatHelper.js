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
		console.log(message);
		if(message.type == 10){
			$('#setNickname').modal('hide');
		}
		else if(message.type == 5){
			var historicalText = $("#chatHistoryTextArea").val();
			$("#chatHistoryTextArea").val(historicalText + message.sender + " " + message.chatMsg.chatMsg + "\n");			
		}
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
	$("#sendMsgBtn").click(function(){
		socket.emit('sendChat',{chatMsg: $('#chatMsgTxtBox').val()});
		var historicalText = $("#chatHistoryTextArea").val();
		$("#chatHistoryTextArea").val(historicalText + "Me: " + $("#chatMsgTxtBox").val() + "\n");
		$("#chatMsgTxtBox").val("");
		return false;
	})
});