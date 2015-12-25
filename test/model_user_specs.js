var user = require('../models/user'),
    expect = require('chai').expect,
    dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client;

function delete_all_objects(done) {
  var finished_count = 0;
  dynamodb_client.scan({TableName: 'User'}, function(err, data) {
    if (data.Count == 0) done();
    var count = data.Count;
    for (var i=0; i<count; i++) {
      var params = {
        TableName: 'User',
        Key: {
          'email': data.Items[i].email
        }
      }

      dynamodb_client.delete(params, function(err, data) {
        if (err) throw err;
        finished_count++;
        if (finished_count == count) done();
      });
    }
  });
}

describe('User', function() {

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
      }

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

  describe('#list', function() {

    it('Should list three results', function(done) {

      user.list(function(err, data) {
        expect(data.length).to.equal(3);
        done();
      });

    });

  });

  describe('#delete', function() {

    it('Should return the deleted item', function(done) {

      user.delete('test0@email.com', function(err, data) {
        expect(data.email).to.equal('test0@email.com');
        done();
      });
    });

    it('Should return undefined if not found', function(done) {

      user.delete('test42@email.com', function(err, data) {
        expect(data).to.equal(undefined);
        done();
      });

    });

  });

  describe('#put', function() {

    it('Should return an empty object when successful', function(done) {
      user.put({email: 'test9@email.com', password: 'password', nickname: 'nacknomm'}, function(err, data) {
        expect(data).to.be.an.Object;
        expect(data).to.be.empty;
        done();
      });
    });

    it('Should update an old object with new attributes.', function(done) {
      user.put({email: 'test0@email.com', password: 'password', nickname: 'nacknomm'}, function(err, data) {
        user.get('test0@email.com', function(err, data) {
          expect(data).to.not.equal(null);
          expect(data.nickname).to.equal('nacknomm');
          done();
        });
      });
    });
  });
});
