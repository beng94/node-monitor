var mongoose = require('mongoose');
var randToken = require('rand-token');

var ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    api_key: {
        type: String,
        default: function() {
            return randToken.generate(64);
        },
    },
    config: [{
        name: { type: String, require: true },
        script: { type: String, required: true },
        interval: { type: Number, rquired: true }
    }]
});

// TODO: Can we simplify this?
var Client;
if(mongoose.models.Client) {
    Client = mongoose.model('Client');
} else {
    Client = mongoose.model('Client', ClientSchema);
}

module.exports = Client;
