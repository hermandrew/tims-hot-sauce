var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client,
    validator = require('validate.js');

exports.get = function(email, callback) {
  var params = {
    TableName: 'Tester',
    Key: {
      email: email
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data ? data.Item : null);
  });
};

exports.put = function(batch, callback) {
  var params = {
    TableName: 'Tester',
    Item: batch
  };

  dynamodb_client.put(params, callback);
};

exports.delete = function(email, callback) {
  var params = {
    TableName: 'Tester',
    Key: {
      email: email,
    },
    ReturnValues: 'ALL_OLD'
  };

  dynamodb_client.delete(params, function(err, data) {
    callback(err, data ? data.Attributes : null);
  });
};

exports.list = function(callback) {
  dynamodb_client.scan({TableName: 'Tester'}, function(err, data) {
    callback(err, data ? data.Items : null);
  });
};

exports.validate = function(tester) {
  validator.validators.free_entry_array = function(value, options, key, attributes) {
    if(!(value instanceof Array)) return key + ' in ' + JSON.stringify(attributes) + ' is not an array.';

    for(var i=0; i<value.length; i++) {
      if (value[i].trim().length === 0) return 'This array contains empty elements.';
    }

    return null;
  };

  var constraints = {
    email: {
      presence: true,
      email: true
    },
    nickname: {
      presence: true,
      length: {
        minimum: 3,
        maximum: 30
      }
    },
    bottles: {
      presence: false,
      free_entry_array: true
    },
    "mailing_address.address1": { presence: true },
    "mailing_address.address2": { presence: false },
    "mailing_address.city" : {
      presence: true,
      format: {
        pattern: '[a-zA-Z]+',
      },
      length: {
        minimum: 2,
        maximum: 30
      },
      "mailing_address.state": {
        presence: true,
        format: {
          pattern: '[A-Z]+'
        },
        length: { is: 2 }
      },
      "mailing_address.zip": {
        presence: true,
        format: {
          pattern: '[0-9]+'
        },
        length: { is: 5 }
      }
    }
  };

  return validator(tester, constraints);
};
