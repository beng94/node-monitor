var chai = require('chai');
var spies = require('chai-spies');
var should = chai.should();
var expect = chai.expect;
var io = require('socket.io-client');
var app = require('./../app');

chai.use(spies);


describe('Socket', function(done) {
    var ios;

    before(function(done) {
        app.listen(3000, function() {
            done();
        });
    });

    after(function(done) {
        app.close();
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
            ios.emit('authenticate', {});

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
            bob.emit('authenticate', {});
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
});
