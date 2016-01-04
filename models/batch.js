var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client,
    validator = require('validate.js');

exports.get = function(recipe_name, created_date, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_batch',
    Key: {
      recipe_name: recipe_name,
      created_date: created_date
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data ? data.Item : null);
  });
};

exports.put = function(batch, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_batch',
    Item: batch
  };

  dynamodb_client.put(params, callback);
};

exports.delete = function(recipe_name, created_date, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_batch',
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
  dynamodb_client.scan({TableName: process.env.NODE_ENV + '_batch'}, function(err, data) {
    callback(err, data ? data.Items : null);
  });
};

exports.validate = function(batch) {
  validator.validators.free_entry_array = function(value, options, key, attributes) {
    if(!(value instanceof Array)) return key + ' in ' + JSON.stringify(attributes) + ' is not an array.';

    for(var i=0; i<value.length; i++) {
      if (value[i].trim().length === 0) return 'This array contains empty elements.';
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
    notes: {
      presence: false,
      free_entry_array: true
    },
    bottles: {
      presence: false,
      free_entry_array: true
    }
  };

  return validator(batch, constraints);
};
