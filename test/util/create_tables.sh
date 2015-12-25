aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "User",
  "KeySchema": [
    { "AttributeName": "email", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "email", "AttributeType": "S" }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 10,
    "WriteCapacityUnits": 10
  }
}'
