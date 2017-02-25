var Client = require('./model/client');

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

        socket.on('authenticate', function(key) {
            Client.findOne({ api_key: key }, 'name', function(err, doc)  {
                if(doc) {
                    //console.log('auth success: %s', doc.name);
                    socket.auth = true;
                    socket.name = doc.name;
                } else {
                    //console.log('auth failed: invalid token');
                }
            });
        });

        socket.on('data', function(data) {
            if(check_auth()) {
                // Process data
            }
        });

        setTimeout(check_auth, 1000);
    });

}
