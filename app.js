var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.set('port', process.env.PORT || 8080);


var server = app.listen(app.get('port'), function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
var io = require('socket.io').listen(server);
var users =  {};
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log(msg);
        io.emit('chat message', msg);
    });
    console.log('a user connected');
    socket.on('disconnect', function (msg) {
        console.log(users[this.id]);
        io.emit('disconnect', this.id);
        delete users[this.id];
    });
    socket.on('login', function (msg) {
        users[this.id] = msg;
        console.log(msg + 'logged in');
        io.emit('login', {socket:this.id,name:msg});
    })
});

app.get('/users', function (req,res) {
   res.send(users);
});
app.use(bodyParser.json());

