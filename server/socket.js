module.exports = function(io) {

    io.on('connection', function(socket) {

        var check_auth = function() {
            if(!socket.auth) {
                socket.disconnect('unauthorized');
                return false;
            }
            return true;
        }

        socket.auth = false;

        socket.on('authenticate', function(date) {
            socket.auth = true;
        });

        socket.on('data', function(data) {
            if(check_auth()) {
                // Process data
            }
        });

        setTimeout(check_auth, 1000);
    });


}
