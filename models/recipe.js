var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client,
    validator = require('validate.js');

exports.get = function(name, created_date, callback) {
  var params = {
    TableName: 'Recipe',
    Key: {
      name: name,
      created_date: created_date
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data ? data.Item : null);
  });
};

exports.put = function(recipe, callback) {
  var params = {
    TableName: 'Recipe',
    Item: recipe
  };

  dynamodb_client.put(params, callback);
};

exports.delete = function(name, created_date, callback) {
  var params = {
    TableName: 'Recipe',
    Key: {
      name: name,
      created_date: created_date
    },
    ReturnValues: 'ALL_OLD'
  };

  dynamodb_client.delete(params, function(err, data) {
    callback(err, data ? data.Attributes : null);
  });
};

exports.validate = function(recipe) {
  validator.validators.free_entry_array = function(value, options, key, attributes) {
    if(!(value instanceof Array)) return key + ' in ' + JSON.stringify(attributes) + ' is not an array.';

    for(var i=0; i<value.length; i++) {
      if (value[i].trim().length === 0) return 'This array contains empty elements.';
    }

    return null;
  };

  var constraints = {
    name: {
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
    ingredients: {
      presence: false,
      free_entry_array: true
    },
    directions: {
      presence: false,
      free_entry_array: true
    },
    batches: {
      presence: false,
      free_entry_array: true
    }
  };

  return validator(recipe, constraints);
};
