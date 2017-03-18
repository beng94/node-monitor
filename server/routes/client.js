var express = require('express');
var router = express.Router();

var Client = require('./../model/client');

router.route('/')
    .get(function(request, response) {
        console.log('GET client');
        var clientId = request.body.clientId;

        if(!clientId) {
            Client.find({}, function(err, doc) {
                if(err) {
                    console.log(err);
                    response.status(500).json('Internal db error');
                    return;
                }
                response.json(doc);
            });
            return;
        }

        Client.findOne({_id: clientId}, function(err, doc) {
            if(err) {
                console.error(err);
                response.status(400).json('Invalid client');
            }

            if(!doc) {
                response.status(404).json('Client not found');
            } else {
                response.json(doc);
            }
        });
    })
    .post(function(request, response) {
        var client = new Client(request.body);
        client.save(function(err) {
            if(err) {
                console.log(err);
                response.status(400).json('Couldn\'t create client');
            } else {
                response.status(201).json(client);
            }
        });
    })
    .delete(function(request, response) {
        var clientId = request.body.clientId;

        if(!clientId) {
            response.status(400).json('Invlid Client params');
            return;
        }

        Client.findByIdAndRemove(clientId, function(error, doc) {
            if(error) {
                console.log(err);
                response.status(400).json('Couldn\'t delete client');
            }

            if(!doc) {
                response.status(404).json('Client not found');
            } else {
                response.status(200).json('Client removed');
            }
        });
    });

module.exports = router;
