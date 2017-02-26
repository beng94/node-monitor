var chai = require('chai');
var spies = require('chai-spies');
var should = chai.should();
var expect = chai.expect;
var io = require('socket.io-client');
var app = require('./../app');
var Client = require('./../model/client');
var randToken = require('rand-token');
var Data = require('./../model/data');

chai.use(spies);


describe('Socket', function(done) {
    var ios;
    var client;

    before(function(done) {
        app.listen(3000);

        client = new Client({name: 'Test client'});
        client.save();
        done();
    });

    after(function(done) {
        app.close();
        Client.find(client).remove().exec();
        done();
    });

    beforeEach(function(done) {
        ios = io.connect('http://localhost:3000');
        done();
    });

    afterEach(function(done) {
        ios.close();
        done();
    });

    it('Opens the socket', function(done) {
        ios.on('connect', function() {
            done();
        });
    });

    it('Closes the socket after 1s without auth', function(done) {
        var start;
        ios.on('connect', function(socket) {
            start = new Date();

            ios.on('disconnect', function() {
                var timeout = new Date() - start;
                var lowerBound = new Date(start.getTime() + 900) - start;;
                var upperBound = new Date(start.getTime() + 1100) - start;;
                expect(timeout).to.be.within(lowerBound, upperBound);
                done();
            });
        });
    });

    it('Keeps open with valid authentication', function(done) {
        var connected = false;
        ios.on('connect', function(data) {
            connected = true;
            ios.emit('authenticate', client.api_key);

            ios.on('disconnect', function() {
                connected = false;
            })

            setTimeout(function() {
                expect(connected).to.be.true;
                done();
            }, 1100);
        });
    })

    it('Disconnects only the unauthorized client', function(done) {
        var bob = io.connect('http://localhost:3000');
        var alice = io.connect('http://localhost:3000');

        var bobConnected = false;
        bob.on('connect', function() {
            bobConnected = true;
            bob.emit('authenticate', client.api_key);
            bob.on('disconnect', function() {
                bobConnected = false;
            })
        });

        var aliceConnected = false;
        alice.on('connect', function() {
            aliceConnected = true;

            alice.on('disconnect', function() {
                aliceConnected = false;
            })
            setTimeout(function() {
                expect(aliceConnected).to.be.false;
                expect(bobConnected).to.be.true;
                done();
            }, 1500);
        })
    });

    it('Cant send data before authentication', function(done) {

        var disconnected = false;
        ios.on('connect', function() {
            ios.emit('data', {donkey: 'monkey'});
        });

        ios.on('disconnect', function() {
            disconnected = true;
        });

        setTimeout(function() {
            expect(disconnected).to.be.true;
            done();
        }, 200);
    });

    it('Saves data on \'data\' events', function(done) {
        ios.on('connect', function() {
            ios.emit('authenticate', client.api_key);
            var testKey = randToken.generate(64);
            ios.emit('data', {key: testKey});

            setTimeout(function() {
                Data.findOne({data: {key: testKey}}, function(err, doc) {
                    if(doc) {
                        done();
                    }
                })
            }, 300);
        });
    });
});
