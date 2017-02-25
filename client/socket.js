module.exports = function(server) {
    var socket = require('socket.io-client')(server);

    socket.on('connect', function(){
        console.log('connected');

        socket.emit('authenticate', {});
        socket.emit('data', { monkey: 'Donkey' });
    });

    socket.on('disconnect', function() {
        console.log('disconnected');
    });
}
