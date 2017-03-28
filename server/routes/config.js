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
        console.log("POST config");
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

                emitter.notifyClientSocket(clientId, 'config', doc.config);

                response.status(200).json('Updated');
            });
        });
    })
    .delete(function(request, response) {
        console.log("DELETE config");
        var configId = request.params.clientId;

        if(!configId) {
            console.log("Invalid params");
            response.status(400).json('Invalid params');
            return;
        }

        Client.update(
            {},
            { $pull: { config: { _id: configId } } },
            { multi: true }
        , function(err, result) {
            if(err) {
                console.error(err);
                response.status(500).json('Internal db error');
                return;
            } else {
                /* Success */
                if(result.nModified) {
                    console.log('Config ' + configId + ' deleted');
                    response.status(200).json('Deleted');
                } else {
                    /* Failed to delete */
                    console.log('Config ' + configId + ' not found');
                    response.status(410).json('Config id ' + configId + ' not found');
                }
            }
        });
    });

module.exports = router;
