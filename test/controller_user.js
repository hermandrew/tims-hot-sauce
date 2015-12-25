var request = require('supertest'),
    dynamodb_client = require('../lib/dynamodb_client.js').dynamodb_client,
    user_controller = require('./../controllers/user.js'),
    app = require('./../app.js');

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

describe('Requests to the path /users', function() {

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
          password: 'password' + i,
          nickname: 'nickname' + i
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

  describe('#GET', function(done) {
    it('Returns a 200 status code', function(done) {
      request(app)
        .get('/users')
        .expect(200, done);
    });

    it('Returns JSON', function(done) {
      request(app)
        .get('/users')
        .expect('Content-Type', /json/, done);
    });

    it('Returns all records', function(done) {
      request(app)
        .get('/users')
        .expect(function(res) {
          if(res.body.length !== 3) throw new Error('Did not retrieve all users.');
        })
        .end(done);
    });
  });

  describe('#POST', function() {
    it(('Returns a 201'), function(done) {
      request(app)
        .post('/users')
        .send({email:'email@email.com', password: 'password', nickname: 'nickname'})
        .expect(201, done);
    });

    it('Returns JSON', function(done) {
      request(app)
        .get('/users')
        .send({email:'email@email.com', password: 'password', nickname: 'nickname'})
        .expect('Content-Type', /json/, done);
    });
  });
});
