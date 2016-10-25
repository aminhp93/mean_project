var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './bower_components')));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

var server = app.listen(8000, function() {
    console.log('Project on port 8000');
})

var io = require('socket.io').listen(server);

var visitors = {};
io.on('connection', function(socket) {
    socket.on('new_user', function(data) {
        if (parseInt(Object.keys(visitors).length) > 0)
            socket.emit('already', { visitors: visitors });
        visitors[socket.id] = data.pos;
        io.emit('connected', { pos: data.pos, users_count: Object.keys(visitors).length });
        console.log('someone CONNECTED:');
        console.log(visitors);
    });
    socket.on('disconnect', function() {
        if (visitors[socket.id]) {
            var todel = visitors[socket.id];
            delete visitors[socket.id];
            io.emit('disconnected', { del: todel, users_count: Object.keys(visitors).length });
        }
        console.log('someone DISCONNECTED:');
        console.log(visitors);
    });
});
