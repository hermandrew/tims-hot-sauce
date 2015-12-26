var request = require('supertest'),
    dynamodb_client = require('../lib/dynamodb_client.js').dynamodb_client,
    app = require('./../app.js'),
    user = require('./../models/user.js');

function delete_all_objects(done) {
  var finished_count = 0;
  dynamodb_client.scan({TableName: 'User'}, function(err, data) {
    if (data.Count === 0) done();
    var count = data.Count;
    for (var i=0; i<count; i++) {
      var params = {
        TableName: 'User',
        Key: {
          'email': data.Items[i].email
        }
      };

      dynamodb_client.delete(params, function(err, data) {
        if (err) throw err;
        finished_count++;
        if (finished_count == count) done();
      });
    }
  });
}

describe('Requests to the path /user', function() {

  before(function(done) {
    delete_all_objects(done);
  });

  beforeEach(function(done) {
    var finished_count = 0;
    for (var i=0; i<3; i++) {
      var params = {
        TableName: 'User',
        Item: {
          email: 'test' + i + '@email.com',
          password: 'password' + ['a', 'b', 'c'][i],
          nickname: 'nickname' + ['a', 'b', 'c'][i]
        }
      };

      dynamodb_client.put(params, function(err, data) {
        if (err) throw err;
        finished_count++;
        if (finished_count == 3) done();
      });
    }
  });

  afterEach(function(done) {
    delete_all_objects(done);
  });

  describe('Requests to /', function() {
    describe('#GET', function() {
      it('Returns a 200 status code', function(done) {
        request(app)
          .get('/user')
          .expect(200, done);
      });

      it('Returns JSON', function(done) {
        request(app)
          .get('/user')
          .expect('Content-Type', /json/, done);
      });

      it('Returns all records', function(done) {
        request(app)
          .get('/user')
          .expect(function(res) {
            if(res.body.length !== 3) throw new Error('Did not retrieve all users.');
          })
          .end(done);
      });
    });

    describe('#POST', function() {
      it(('Returns a 201'), function(done) {
        request(app)
          .post('/user')
          .send({email:'email@email.com', password: 'password', nickname: 'nickname'})
          .expect(201, done);
      });

      it('Returns JSON', function(done) {
        request(app)
          .get('/user')
          .send({email:'email@email.com', password: 'password', nickname: 'nickname'})
          .expect('Content-Type', /json/, done);
      });

      it('Returns 400 if parameters are invalid', function(done) {
        request(app)
          .post('/user')
          .send({email: 'email', password: '1', nickname: 'nick name'})
          .expect(400, done);
      });

      it('Returns 409 if user already exists', function(done) {
        request(app)
          .post('/user')
          .send({email: 'test0@email.com', password: 'password', nickname: 'nickname'})
          .expect(409, done);
      });
    });
  });

  describe('requests to /:email', function() {
    describe('#GET', function() {

      it('Returns 200 with the object if it exists.', function(done) {
        request(app)
          .get('/user/test0@email.com')
          .expect(function(response) {
            var this_user = response.body;
            if(user.validate(this_user)) throw new Error('Returned object is invalid');
          })
          .end(done);
      });

      it('Returns 404 if the object does not yet exist', function(done) {
        request(app)
          .get('/user/notthere@email.com')
          .expect(404, done);
      });
    });

    describe('#PUT', function() {

      it('Returns 404 if the user doesn\'t exist', function(done) {
        request(app)
          .put('/user/test7@email.com')
          .send({email: 'test7@email.com', password: 'password', nickname: 'nickname'})
          .expect(404, done);
      });

      it('Returns 409 if the URL param doesn\'t match the body param', function(done) {
        request(app)
          .put('/user/test2@email.com')
          .send({email: 'test3@email.com', password: 'password', nickname: 'nickname'})
          .expect(409, done);
      });

      it('Returns 400 if the user submitted is invalid', function(done) {
        request(app)
          .put('/user/test2@email.com')
          .send({email: 'test2@email.com', password: 'p', nickname: 'nick name'})
          .expect(400, done);
      });

      it('Returns 200 when all data is valid and the user exists', function(done) {
        request(app)
          .put('/user/test2@email.com')
          .send({email: 'test2@email.com', password: 'password', nickname: 'nickname'})
          .expect(200, done);
      });
    });
  });
});
