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

        Data.find({clientId: clientId}, function(err, doc) {
            if(err) {
                console.error(err);
                response.status(400).json('Invalid client');
            }

            var socketId = emitter.registerRestSocket(clientId);
            var resp = {
                datas: doc,
                socket: socketId
            };

            response.json(resp);
        });
    });

module.exports = router;
