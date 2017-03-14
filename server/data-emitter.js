'use strict'

const EventEmitter = require('events').EventEmitter;
var restSocket = require('./rest-socket');
var randToken = require('rand-token');

class DataEmitter extends EventEmitter {
    constructor() {
        super();
    }

    registerRestSocket(clientId) {
        var tag = randToken.generate(64);
        this.on(clientId, function(data) {
            console.log('emitting data' + tag + " " + data);
            restSocket.io.emit(tag, data);
        });

        return tag;
    }
}

module.exports = new DataEmitter();
