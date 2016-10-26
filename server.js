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

        visitors[socket.id] = data;
        io.emit('connected', { pos: data.pos, user_id: data.user_id, users_count: Object.keys(visitors).length });


        console.log('someone CONNECTED:');
        console.log(visitors);
        console.log(Object.keys(visitors));
        for (var i = 0; i < Object.keys(visitors).length; i++) {
            for (var j = 0; j < Object.keys(visitors).length; j++) {
                if (i != j) {
                    var distance = calculateDistance(visitors[Object.keys(visitors)[i]].pos.lat, visitors[Object.keys(visitors)[i]].pos.lng, visitors[Object.keys(visitors)[j]].pos.lat, visitors[Object.keys(visitors)[j]].pos.lng);
                    console.log(distance);
                }
            }
        }
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

    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
});
