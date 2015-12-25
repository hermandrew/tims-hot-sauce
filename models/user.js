var dynamodb_client = require('./../lib/dynamodb_client').dynamodb_client;

/**
 * Lists all the users that are in the table.
 *
 * @param {function} callback Function that's called back when data is retrieved.
 */
exports.list = function(callback) {
  var params = {
    TableName: 'User',
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
    TableName: 'User',
    Key: {
      email: email_address
    }
  };

  dynamodb_client.get(params, function(err, data) {
    callback(err, data.Item);
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
    TableName: 'User',
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
    TableName: 'User',
    Key: {
      email: email_address
    },
    ReturnValues: 'ALL_OLD'
  };

  dynamodb_client.delete(params, function(err, data) {
    callback(err, data.Attributes);
  });
};
