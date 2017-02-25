module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.auth = false;

        socket.on('authenticate', function(date) {
            socket.auth = true;
        });

        setTimeout(function() {
            if(!socket.auth) {
                socket.disconnect('unauthorized');
            }
        }, 1000);
    });


}
