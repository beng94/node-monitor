var express = require('express');
var router = express.Router();

var Client = require('./../model/client');
var emitter = require('./../data-emitter');

router.route('/:clientId')
    .get(function(request, response) {
        console.log("GET config");

        var clientId = request.params.clientId;
        if(!clientId) {
            console.log("Invalid params");
            response.status(400).json('Invalid params');
            return;
        }

        Client.findOne({_id: clientId}, function(err, doc) {
            if(err) {
                console.log(err);
                response.status(500).json('Internal db error');
            }

            response.json(doc.config);
        });
    })
    .post(function(request, response) {
        console.log("POST data");
        var clientId = request.params.clientId;

        if(!clientId) {
            console.log("Invalid params");
            response.status(400).json('Invalid params');
            return;
        }

        Client.findOne({_id: clientId}, function(err, doc) {
            if(err) {
                console.error(err);
                response.status(500).json('Internal db error');
            }

            doc.config = request.body;
            doc.save(function(err) {
                if(err) {
                    console.error(err);
                    response.status(500).json('Internal db error');
                    return;
                }

                response.status(200).json('Updated');
            });
        });
    });

module.exports = router;
