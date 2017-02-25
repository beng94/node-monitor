var chai = require('chai')
var expect = chai.expect;

describe('Client socket', function(done) {

    var client = require('./../socket');
    var app = require('express');
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    var config = {
        name: 'Test config',
        script: "'Test data'",
        interval: 500
    };


    before(function(done) {
        server.listen(6000);
        done();
    })

    beforeEach(function(done) {
        client.connect('http://localhost:6000');
        done();
    });

    afterEach(function(done) {
        client.close();
        done();
    });

    after(function(done) {
        server.close();
        done();
    })

    it('sends data on interval', function(done) {
        var events = [];
        io.on('connection', function(socket) {
            socket.on('data', function(data) {
                events.push(new Date());
                if(events.length == 2) {
                    var interval = events[1] - events[0];
                    expect(interval).to.be.within(450, 600);
                    done();
                }
            });
        });

        client.addMonitor(config);
    });

    it('sends data from eval', function(done) {
        io.on('connection', function(socket) {
            socket.on('data', function(data) {
                expect(data).to.be.equal('Test data');
                done();
           });
        })

        client.addMonitor(config);
    });

    it('doesn\'t close when eval is malformed', function(done) {

        var f = function() {
            var localConfig = config;
            localConfig.script = 'asd;sd';
            client.addMonitor(localConfig);
        }

        expect(f).not.to.throw(Error);
        done();
    });

    it('tries to authenticate', function(done) {
        io.on('connection', function(socket) {
            socket.on('authenticate', function(data) {
                done();
            });
        });
    });
});

describe('Server connection', function(done) {
    var server = require('./../../server/app');
    var client = require('./../socket');

    before(function(done) {
        server.listen(6000);
        done();
    });

    after(function(done) {
        server.close();
        done();
    });

    it('can be established', function(done) {
        client.connect('http://localhost:6000');
        client.getSocket().on('connect', function(){
            client.close();
            done();
        });
    })
});
