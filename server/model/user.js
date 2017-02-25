var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    clients: [{ type: mongoose.Schema.ObjectId, ref: 'Client' }],
    last_login: { type: Date, default: Date.now },
});

// TODO: Can we simplify this?
var User;
if(mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;
