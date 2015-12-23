var user = require('../models/user'),
    expect = require('chai').expect,
    tables = require('./util/tables'),
    dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client;

describe('User', function() {

  beforeEach(function() {
    tables.create_user_table(function(){});
  });

  afterEach(function() {
//    tables.delete_all_tables(function(){});
  });

  describe('#list', function() {

      before(function() {
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
          });
        }
      });

      it('Should list three results', function() {

        user.list(function(data) {
          expect(data.length).to.equal(3);
        });

      });

    });

});
