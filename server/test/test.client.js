var request = require('supertest');
var expect = require('chai').expect;
var app = require('./../app');
var Client = require('./../model/client');

describe('REST for client', function(done) {

    var existingClient = new Client({name: 'Mocha test'});
    var nonExistingClient = {clientId: '58bc49eec3a027238deb0e6c'};
    var invalidClient = {};

    before(function(done) {
        existingClient.save(function(err) {
            done();
        });
    });

    after(function(done) {
        Client.find(existingClient).remove().exec();
        done();
    });

    describe('GET', function(done) {

        it('returns 200 for valid', function(done) {
            request(app)
                .get('/client')
                .send({clientId: existingClient._id})
                .expect(200, done);
        });

        it('returns 404 for non existing', function(done) {
            request(app)
                .get('/client')
                .send(nonExistingClient)
                .expect(404, done);
        });

        it('returns 200 for empty body', function(done) {
            request(app)
                .get('/client')
                .expect(200, done)
        });

    });

    describe('POST', function(done) {

        it('returns 201 for valid', function(done) {
            var client = {name: 'Mocha POST valid client test'};

            request(app)
                .post('/client')
                .send(client)
                .expect(201);

            Client.find(client).remove().exec();
            done();
        });

        it('creates a new db entry', function(done) {
            var client = {name: 'Mocha POST created db entry'};
            request(app).post('/client').send(client);

            Client.findOne(client, function(err, doc) {
                expect(doc);
                Client.find(client).remove().exec();
                done();
            });
        });

        it('returns 400 for invalid body', function(done) {
            request(app)
                .post('/client')
                .send(invalidClient)
                .expect(400, done);
        });

    });

    describe('DELETE', function(done) {

        it('returns 200 for valid', function(done) {
            var client = new Client({name: 'Mocha DELETE test'});
            client.save(function(err) {
                request(app)
                    .delete('/client')
                    .send({clientId: existingClient._id})
                    .expect(200, done);
            });
        });

        it('returns 404 for non existing', function(done) {
            request(app)
                .delete('/client')
                .send(nonExistingClient)
                .expect(404, done);
        });

        it('returns 400 for invalid body', function(done) {
            request(app)
                .delete('/client')
                .send(invalidClient)
                .expect(400, done);
        });

    });

});
