var mongoose = require('mongoose');
var randToken = require('rand-token');

var ClientSchema = new mongoose.Schema({
    name: String,
    api_key: {
        type: String,
        default: function() {
            return randToken.generate(64);
        }
    }
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
