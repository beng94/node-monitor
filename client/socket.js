var io = require('socket.io-client');
var socket;

var monitors = {};

function registerMonitor(config) {
    return setInterval(function() {
        'use strict'

        try {
            var data = eval(config.script);
            var payload = {
                name: config.name,
                time: new Date(),
                paylog: data
            };
            socket.emit('data', payload);
            console.log('data sent: %j', payload);
        } catch(err) {
            console.log('Could not execute monitor: %s', err);
            removeMonitor(config.name);
            console.log('Removed monitor: %s', config.name);
        }
    }, config.interval);
}

function connect (server, apiKey) {
    socket = io(server);

    socket.on('connect', function(){
        //console.log('connected');
        socket.emit('authenticate', {});
        socket.emit('authenticate', apiKey);

        socket.on('config', function(config) {
            console.log('Config update request received');
            updateConfig(config);
        });
    });

    socket.on('disconnect', function() {
        //console.log('disconnected');
    });
};

function addMonitor(config) {
    var monitorId = registerMonitor(config);
    config.monitorId = monitorId;
    monitors[config.name] = config;
};

function removeMonitor(name) {
    var monitorId = monitors[name].monitorId;
    clearInterval(monitorId);
};

function removeEveryMonitor() {
    for(var name in monitors) {
        removeMonitor(name);
    }
};

function updateConfig(config) {
    removeEveryMonitor();

    for(var i = 0; i < config.length; i++) {
        var conf = config[i];
        console.log('New config: ', conf.name);
        addMonitor(conf);
    }
};

function close() {
    //console.log('Closing');
    for(var name in monitors) {
        removeMonitor(name);
    }
    socket.close();
}

function getSocket() {
    return socket;
}


exports.getSocket= getSocket;
exports.connect = connect;
exports.addMonitor = addMonitor;
exports.removeMonitor = removeMonitor;
exports.close = close;
