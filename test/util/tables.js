var dynamodb = require('../../lib/dynamodb_client').dynamodb_service,
    _ = require('underscore');

function does_table_exist(table_name, callback) {
  callback(true);
//  var params = {
//    ExclusiveStartTableName: '',
//    Limit: 0
//  }
//
//  dynamodb.listTables(params, function(err, data) {
//    console.log(data);
//    if(data && _.contains(data, table_name)) callback(true);
//    return callback(false);
//  });
}

exports.create_user_table = function(callback) {
  var params = {
    TableName: 'User',
    KeySchema: [
      { AttributeName: 'email', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  };

  dynamodb.createTable(params, function(err, data) {
    if (err) console.log(err)/
    callback(data);
  });
};

exports.delete_all_tables = function(callback) {
  callback();
//  does_table_exist('User', function(exists) {
//    if (exists) {
//      var params = {
//        TableName: 'User',
//      };
//
//      dynamodb.deleteTable(params, function(err, data) {
//        if (err) console.log(err);
//        callback(data);
//      });
//    }
//  });
}
