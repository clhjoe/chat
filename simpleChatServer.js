var fs = require('fs');
function readLines(input, dict) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      console.log('Line: ' + line);
      dict.push(line);
      index = remaining.indexOf('\n', last);
    }

    remaining = remaining.substring(last);
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}
var dict=[];
var input = fs.createReadStream('nameDict.txt');
readLines(input,dict);
// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express=require('express');

// Init globals variables for each module required
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// launch the http server on given port
server.listen(8080);

// routing with express, mapping for default page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/multiRoomChat.html');
});

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/simpleChat.html');
});

// usernames which are currently connected to the chat
var usernames = {};
var usercount=0;
io.sockets.on('connection', function (socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
        var newName=socket.username;
        if(socket.username=="aa")
            newName=dict[Math.floor(Math.random()*dict.length)];
		io.sockets.emit('updatechat', newName, data);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
        usercount++;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'Fuck Lead', 'you have sun of bitch connected');
        socket.emit('updateusercount',usercount);
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'Fuck Lead  bitch', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'Fuck Lead', socket.username + ' has disconnected');
        usercount--;
        socket.emit('updateusercount',usercount);
	});
});
