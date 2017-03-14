var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports.http = http;
module.exports.io = io;
