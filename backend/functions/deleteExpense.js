const AWS = require('aws-sdk');
const { extractIds } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Extract userId and expenseId
        const { userId, expenseId } = extractIds(event);

        console.log('userId:', userId, 'expenseId:', expenseId);

        // Check if the expense exists and belongs to the user
        const getParams = {
            TableName: 'Expenses',
            Key: {
                userId,
                expenseId,
            },
        };

        const expense = await dynamoDb.get(getParams).promise();
        if (!expense.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Expense not found or does not belong to the user' }),
            };
        }

        // Delete the expense
        const deleteParams = {
            TableName: 'Expenses',
            Key: {
                userId,
                expenseId,
            },
        };

        await dynamoDb.delete(deleteParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Expense deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting expense:', error);
        return {
            statusCode: error.message.includes('Unauthorized') ? 401 : 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};