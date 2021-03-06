aws dynamodb "$@" --endpoint-url http://localhost:8000 create-table --cli-input-json \
'{
  "TableName": "test_user",
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
  "TableName": "test_recipe",
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
  "TableName": "test_batch",
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
  "TableName": "test_bottle",
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
  "TableName": "test_tester",
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

