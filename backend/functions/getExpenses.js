const AWS = require('aws-sdk');
const { extractUserId } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Extract userId using the utility function
        const userId = extractUserId(event);

        if (!userId) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized: Missing user ID in claims' }),
            };
        }

        // DynamoDB query parameters
        const params = {
            TableName: 'Expenses',
            IndexName: 'userId-index', // Replace with your GSI name if applicable
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        // Query the DynamoDB table
        const { Items } = await dynamoDb.query(params).promise();

        // Return the list of expenses
        return {
            statusCode: 200,
            body: JSON.stringify(Items),
        };
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching expenses', error: error.message }),
        };
    }
};