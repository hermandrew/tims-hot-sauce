var aws = require('aws-sdk');

aws.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

module.exports.dynamodb_service = new aws.DynamoDB();
module.exports.dynamodb_client = new aws.DynamoDB.DocumentClient();
