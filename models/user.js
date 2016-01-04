var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client,
    validator = require('validate.js');

/**
 * Lists all the users that are in the table.
 *
 * @param {function} callback Function that's called back when data is retrieved.
 */
exports.list = function(callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_user',
  };

  dynamodb_client.scan(params, function(err, data) {
    callback(err, data.Items);
  });
};

/**
 * Gets a specific user by email address.
 *
 * @param {string} email_address The email address of the user attempted to retrieve.
 * @param {function} callback The callback that is called when the DynamoDB client retrieves (or doesn't) the object.
 */
exports.get = function(email_address, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_user',
    Key: {
      email: email_address
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data ? data.Item : null);
  });
};

/**
 * Creates or updates a user in the database.
 *
 * @param {User} user The user that is being created.
 * @param {function} callback The function that will be called back with params err, data, upon attempted creation of the user object.
 */
exports.put = function(user, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_user',
    Item: user
  };

  dynamodb_client.put(params, callback);
};

/**
 * Deletes a model from the database.
 *
 * @param {string}   email_address The email address, and unique ID of the user.
 * @param {function} callback The function that's called back when the delete occurs.
 */
exports.delete = function(email_address, callback) {
  var params = {
    TableName: process.env.NODE_ENV + '_user',
    Key: {
      email: email_address
    },
    ReturnValues: 'ALL_OLD'
  };

  dynamodb_client.delete(params, function(err, data) {
    callback(err, data.Attributes);
  });
};

/**
 * Validates this model for correctness.
 *
 * @param {object} user The user object being validated.
 */
exports.validate = function(user) {
  var constraints = {
    email: {
      presence: true,
      email: true
    },
    password: {
      presence: true,
    },
    nickname: {
      presence: true,
      format: {
        pattern: '[a-zA-Z]+',
        message: '^must only contain letters.'
      },
      length: {
        minimum: 3,
        maximum: 30
      }
    }
  };

  return validator(user, constraints);
};
