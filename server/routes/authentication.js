var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var config = require('./../config.json');
var User = require('./../model/user');

router.route('/')
.post(function(request, response) {
  var name = request.body.name;
  var password = request.body.password;
  if(!name || !password) {
    response.status(400).json("'name' and 'password' fields are compulsory.");
    return;
  }

  var user = User.findOne({
    name: name,
    password: password
  }, function(err, user) {
    if(err) {
      return consol.error(err);
    }

    if(!user) {
      response.status(401).json('Invalid user credential.s');
      return;
    }

    var token = jwt.sign(user, config.jwtSecret);
    response.json({ token: token });
  });
});

module.exports = router;
