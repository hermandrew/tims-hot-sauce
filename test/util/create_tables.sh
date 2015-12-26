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

aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "Recipe",
  "KeySchema": [
    { "AttributeName": "name", "KeyType": "HASH" },
    { "AttributeName": "created_date", "KeyType": "RANGE" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "name", "AttributeType": "S" },
    { "AttributeName": "created_date", "AttributeType": "N" }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 10,
    "WriteCapacityUnits": 10
  }
}'

aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "Batch",
  "KeySchema": [
    { "AttributeName": "recipe_name", "KeyType": "HASH" },
    { "AttributeName": "created_date", "KeyType": "RANGE" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "recipe_name", "AttributeType": "S" },
    { "AttributeName": "created_date", "AttributeType": "N" }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 10,
    "WriteCapacityUnits": 10
  }
}'

aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "Bottle",
  "KeySchema": [
    { "AttributeName": "hash", "KeyType": "HASH" },
    { "AttributeName": "created_date", "KeyType": "RANGE" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "hash", "AttributeType": "S" },
    { "AttributeName": "created_date", "AttributeType": "N" }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 10,
    "WriteCapacityUnits": 10
  }
}'

aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "Tester",
  "KeySchema": [
    { "AttributeName": "nickname", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "nickname", "AttributeType": "S" }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 10,
    "WriteCapacityUnits": 10
  }
}'

