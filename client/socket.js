var io = require('socket.io-client');
var socket;

var monitors = {};

function registerMonitor(config) {
    return setInterval(function() {
        'use strict'

        try {
            var data = eval(config.script);
            socket.emit('data', data);
            //console.log('data sent: %j', data);
        } catch(err) {
            //console.log('Could not execute monitor: %j', err);
            removeMonitor(config.name);
            //console.log('Removed monitor: %s', config.name);
        }
    }, config.interval);
}

function connect (server, apiKey) {
    socket = io(server);

    socket.on('connect', function(){
        //console.log('connected');
        socket.emit('authenticate', {});
        socket.emit('authenticate', apiKey);
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
