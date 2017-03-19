var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');

mongoose.connect('mongodb://localhost/node-monitor');

var socket = require('./socket')(io);
var auth = require('./routes/authentication');
var client = require('./routes/client');
var data = require('./routes/data');
var config = require('./routes/config');
1
var corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/authenticate', auth);
app.use('/client', client);
app.use('/data', data);
app.use('/config', config);

app.get('/', function(request, response)  {
  response.send('Hello world');
});


module.exports = http;
