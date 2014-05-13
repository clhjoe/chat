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
var input = fs.createReadStream('dictionary.txt');
readLines(input,dict);

var io = require('socket.io-client'),
socket = io.connect('localhost', {
    port: 8080
});
socket.on('connect', function () { console.log("socket connected"); });
	socket.emit('adduser', 'aa');
	setInterval(function(){socket.emit('sendchat',dict[Math.floor(Math.random()*dict.length)]);}, 2000)
