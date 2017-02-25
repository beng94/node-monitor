var request = require('supertest');
var expect = require('chai').expect;
var app = require('./../app');
var User = require('./../model/user');

describe('Authentication for socket', function(done) {
  var validUser = {
      name: 'Bence',
      password: 'secret'
  };

  var invalidUser = {
      name: 'Donkey',
      password: 'Monkey'
  };


  beforeEach(function(done) {
    new User(validUser).save();
    done();
  });

  afterEach(function(done) {
    User.find(validUser).remove().exec();
    done();
  });

  describe('Valid user', function(done) {
    it('Returns 200 for valid user', function(done) {
      request(app)
        .post('/authenticate')
        .send(validUser)
        .expect(200, done);
    });

    it('Returns json', function(done) {
      request(app)
        .post('/authenticate')
        .send(validUser)
        .expect('Content-Type', /json/, done);
    });

    it('Returns a token', function(done) {
        request(app)
          .post('/authenticate')
          .send(validUser)
          .end(function(error, response) {
            if(error) {
              return done(error);
            }
            expect(response.body).to.have.key('token');
            done();
          });
    });

    it('It returns a valid token', function(done) {
        throw new Error('Not implemented');
    });
  });

  describe('Invalid user', function(done) {
    it('Requires username and password', function(done) {
      request(app)
        .post('/authenticate')
        .expect(400, done);
    });

   it('Return 401 for invalid user', function(done)  {
      request(app)
        .post('/authenticate')
        .send(invalidUser)
        .expect(401, done);
   });

  });

});
