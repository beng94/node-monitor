var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    data: Object
});

// TODO: Can we simplify this?
var Data;
if(mongoose.models.Data) {
    Data = mongoose.model('Data');
} else {
    Data = mongoose.model('Data', DataSchema);
}

module.exports = Data;
