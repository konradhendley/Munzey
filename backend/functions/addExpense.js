const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { extractUserId } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Extract userId using the utility function
        const userId = extractUserId(event);

        // Parse the JSON body
        const { amount, description, date, category } = JSON.parse(event.body);

        // Ensure required fields are present
        if (!amount || !description || !date) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields: amount, description, or date',
                }),
            };
        }

        // Generate a unique expenseId
        const expenseId = uuidv4();

        // Construct the expense object to be inserted
        const expense = {
            expenseId,
            userId,
            amount,
            description,
            date,
            category: category || null, // Optional field
        };

        // DynamoDB put parameters
        const params = {
            TableName: 'Expenses',
            Item: expense,
        };

        // Save the expense to DynamoDB
        await dynamoDb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Expense added successfully', expense }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.message.includes('Unauthorized') ? 401 : 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};