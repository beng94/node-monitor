var express = require('express');
var router = express.Router();

var Data = require('./../model/data');
var emitter = require('./../data-emitter');

router.route('/')
    .post(function(request, response) {
        console.log("POST data");
        var clientId = request.body.clientId;

        if(!clientId) {
            console.log("Invalid params");
            response.status(400).json('Invalid params');
            return;
        }

        Data.find({clientId: clientId}, {data: 1, _id: 0}, function(err, doc) {
            if(err) {
                console.error(err);
                response.status(400).json('Invalid client');
            }

            console.log(doc);

            var socketId = emitter.registerRestSocket(clientId);
            var resp = {
                payload: doc,
                socket: socketId
            };

            response.json(resp);
        });
    });

module.exports = router;
