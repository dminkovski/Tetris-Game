var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

var User = function()
{
	this.nickname = '';
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res)
{
	res.sendFile(__dirname+'/index.html');
});
app.get('*', function(req, res) {
	res.sendFile(__dirname+'/index.html');
});


io.on('connection',function(socket)
{
	socket.on('user entered',function(nickname)
	{
		var user = new User();
		user.nickname = nickname;
		users[user.nickname] = user;
		console.log('User: '+user.nickname+' entered.');
	});
	socket.on('tetrimino', function(tetrimino)
	{
    io.emit('tetrimino', tetrimino);
		console.log('tetrimino generated');
  });
});

http.listen(3000,function()
{
	console.log('listen on : 3000');
});
