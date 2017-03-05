var request = require('supertest');
var chai = require('chai');
var expect = chai.expect
var should = chai.should;
var app = require('./../app');
var Client = require('./../model/client');
var Data = require('./../model/data');

describe('REST for client', function(done) {

    var client = new Client({name: 'Mocha data test'});
    var dataA = new Data({ clientId: client._id, data: 'data_a' });
    var dataB = new Data({ clientId: client._id, data: 'data_b' });
    var data = [dataA, dataB];

    before(function(done) {
        client.save();
        dataA.save();
        dataB.save();
        done();
    });

    after(function(done) {
        Client.find(client).remove().exec();
        Data.find(dataA).remove().exec();
        Data.find(dataB).remove().exec();
        done();
    });

    describe('GET', function(done) {

        it('returns 200 for valid', function(done) {
            request(app)
                .get('/data')
                .send({clientId: client._id})
                .expect(200, done);
        });

        it('returns 400 for invalid params', function(done) {
            request(app)
                .get('/data')
                .send({})
                .expect(400, done);
        });

        it('returns every data', function(done) {
            request(app)
                .get('/data')
                .send({clientId: client._id})
                .end(function(err, res) {
                    var d = JSON.parse(res.text);
                    expect(d.length).to.equal(data.length);
                    for(var i = 0; i < data.length; i++) {
                        expect(d[i].data).equal(data[i].data);
                    }
                    done();
                });
        });

    });

});
