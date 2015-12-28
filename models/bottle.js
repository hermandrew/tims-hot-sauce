var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client,
    validator = require('validate.js');

exports.get = function(recipe_name, created_date, callback) {
  var params = {
    TableName: 'Bottle',
    Key: {
      recipe_name: recipe_name,
      created_date: created_date
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data ? data.Item : null);
  });
};

exports.put = function(bottle, callback) {
  var params = {
    TableName: 'Bottle',
    Item: bottle
  };

  dynamodb_client.put(params, callback);
};

exports.delete = function(recipe_name, created_date, callback) {
  var params = {
    TableName: 'Bottle',
    Key: {
      recipe_name: recipe_name,
      created_date: created_date
    },
    ReturnValues: 'ALL_OLD'
  };

  dynamodb_client.delete(params, function(err, data) {
    callback(err, data ? data.Attributes : null);
  });
};

exports.list = function(callback) {
  dynamodb_client.scan({TableName: 'Bottle'}, function(err, data) {
    callback(err, data ? data.Items : null);
  });
};

exports.validate = function(bottle) {
  validator.validators.free_entry_array = function(value, options, key, attributes) {
    if(!((value instanceof Array) || (value === undefined)))
       return key + ' in ' + JSON.stringify(attributes) + ' is not an array.';

    if (value instanceof Array) {
      for(var i=0; i<value.length; i++) {
        if (value[i].trim().length === 0) return 'This array contains empty elements.';
      }
    }

    return null;
  };

  var constraints = {
    recipe_name: {
      presence: true,
      format: {
        pattern: '[a-zA-Z_]+',
        message: '^must only contain letters.'
      },
      length: {
        minimum: 3,
        maximum: 30
      }
    },
    created_date: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 1000000000,
        lessThan:    10000000000
      }
    },
    recipe_created_date: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 1000000000,
        lessThan:    10000000000
      }
    },
    batch_created_date: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 1000000000,
        lessThan:    10000000000
      }
    },
    hash: {
      presence: false,
      format: {
        pattern: '[A-Z]+'
      },
      length: { is: 6 }
    },
    tester_email: {
      presence: false,
      email: true
    },
    feedback: {
      presence: false,
      free_entry_array: true
    }
  };

  return validator(bottle, constraints);
};
