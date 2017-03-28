'use strict'

const EventEmitter = require('events').EventEmitter;
var restSocket = require('./rest-socket');
var randToken = require('rand-token');

class DataEmitter extends EventEmitter {

    constructor() {
        super();

        this.clientSockets = {};
    }

    registerRestSocket(clientId) {
        var tag = randToken.generate(64);
        this.on(clientId, function(data) {
            console.log('emitting data' + tag + " " + JSON.stringify(data));
            var paylog = {
                data: data
            };
            restSocket.io.emit(tag, paylog);
        });

        return tag;
    }

    registerClientSocket(clientId, socket) {
        this.clientSockets.clientId = socket;
    }

    notifyClientSocket(clientId, topic, data) {
        var socket = this.clientSockets.clientId;
        if(socket) {
            socket.emit(topic, data);
        }
    }
}

module.exports = new DataEmitter();
