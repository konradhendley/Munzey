const AWS = require('aws-sdk');

// Configure AWS SDK
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;