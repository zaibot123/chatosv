var io = require('socket.io-client');


class ConnectionToRoom {
    constructor(IP) {
        var socket = io.connect(IP, {reconnect: true});


socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.emit('CH01', 'me', 'test msg');
}
}