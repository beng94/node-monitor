var Client = require('./model/client');
var Data = require('./model/data');
var DataEmitter = require('./data-emitter');

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
            Client.findOne({ api_key: key }, function(err, doc)  {
                if(doc) {
                    console.log('auth success: %s', doc.name);
                    socket.auth = true;
                    socket.name = doc.name;
                    socket.id = doc._id;

                    socket.emit('config', doc.config);
                } else {
                    console.log('auth failed: invalid token');
                }
            });
        });

        socket.on('data', function(data) {
            if(check_auth()) {
                console.log('data received %j', data);
                DataEmitter.emit(socket.id, data);
                var data = new Data({
                    clientId: socket.id,
                    data: data
                });
                data.save();
            }
        });

        setTimeout(check_auth, 1000);
    });

}
