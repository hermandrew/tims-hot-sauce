var aws = require('aws-sdk');

aws.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

if (process.env.NODE_ENV == 'dev' ||
    process.env.NODE_ENV == 'prod') {
  aws.config.update({ region: "us-east-1" });
}

module.exports.dynamodb_service = new aws.DynamoDB();
module.exports.dynamodb_client = new aws.DynamoDB.DocumentClient();
