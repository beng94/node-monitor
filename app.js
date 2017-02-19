var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-monitor');

var auth = require('./routes/authentication');

app.use(bodyParser.json());
app.use('/authenticate', auth);

app.get('/', function(request, response)  {
  response.send('Hello world');
});


module.exports = app;
