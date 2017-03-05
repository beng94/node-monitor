var express = require('express');
var router = express.Router();

var Data = require('./../model/data');

router.route('/')
    .get(function(request, response) {
        var clientId = request.body.clientId;

        if(!clientId) {
            response.status(400).json('Invalid params');
            return;
        }

        Data.find({clientId: clientId}, function(err, doc) {
            if(err) {
                console.error(err);
                response.status(400).json('Invalid client');
            }

            response.json(doc);
        });
    });

module.exports = router;
