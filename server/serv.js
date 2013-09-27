var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs');

app.listen(10300);

function handler (req, res) {
    console.log(__dirname);
	fs.readFile(__dirname + '/index.html',function (err, data) {
	if (err) {
		res.writeHead(500);
		return res.end('Error loading index.html');
	}
	res.writeHead(200);
	res.end(data);
	});
}

var on_user = false;
var robby = {};
var _battleId = 0;
var waiting_player = 0;

io.sockets.on('connection', function (socket) {
	socket.emit('connected');
	
	socket.on('disconnect', function () {
		delete robby[socket.id];
		socket.emit('user disconnected');
	});
	
	socket.on('show robby', function (){
		socket.emit('show robby',robby);
	});
	socket.on('enter robby', function (data){
		if(data.nickname){
			if(on_user){
				on_user = false;
				socket.emit('robby on', {
					sid:socket.id, 
					to:waiting_player, 
					bid: _battleId, 
					rname:robby[waiting_player],
					cname:data.nickname
				});
				socket.broadcast.emit('robby on', {
					sid:socket.id, 
					to:waiting_player, 
					bid: _battleId, 
					rname:robby[waiting_player],
					cname:data.nickname
				});
				waiting_player = 0;
			}else{ 
				_battleId++;
				waiting_player = socket.id;
				robby[socket.id] = data.nickname;
				on_user = true;
				socket.emit('robby create', {
					sid:socket.id,
					bid:_battleId,
					rname:data.nickname
				});
			}
		}
	});
	var b_id = null;
	socket.on('ready', function (data) {
		socket.emit('game start', {bid:data.bid});
	});
	
	//doing
	socket.on('move', function(data){
		socket.broadcast.emit('move',{bid:data.bid,x:data.x});
	});
	socket.on('app', function(data){
		socket.broadcast.emit('app',{
			bid:data.bid,
			type:data.type,
			x:data.x,
			y:data.y,k:data.k,f:data.f});
	});
	
});
