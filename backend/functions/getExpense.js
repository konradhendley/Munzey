const AWS = require('aws-sdk');
const { extractIds } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Extract userId and expenseId
        const { userId, expenseId } = extractIds(event);

        if (!userId) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized: Missing user ID in claims' }),
            };
        }

        // DynamoDB get parameters
        const params = {
            TableName: 'Expenses',
            Key: { userId, expenseId },
        };

        // Get the item from the database
        const result = await dynamoDb.get(params).promise();

        // Check if the item exists
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Expense not found' }),
            };
        }

        // Return the expense
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        console.error('Error fetching expense:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching expense', error: error.message }),
        };
    }
};