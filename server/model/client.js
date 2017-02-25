var mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
    name: String,
    api_key: String,
    ip: String,
    // TODO: Config
});

// TODO: Can we simplify this?
var Client;
if(mongoose.models.Client) {
    Client = mongoose.model('Client');
} else {
    Client = mongoose.model('Client', ClientSchema);
}

module.exports = Client;
