var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect('mongodb://localhost/node-monitor');

var socket = require('./socket')(io);
var auth = require('./routes/authentication');
var client = require('./routes/client');

app.use(bodyParser.json());
app.use('/authenticate', auth);
app.use('/client', client);

app.get('/', function(request, response)  {
  response.send('Hello world');
});


module.exports = http;
