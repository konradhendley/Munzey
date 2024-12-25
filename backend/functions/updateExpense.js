const AWS = require('aws-sdk');
const { extractIds } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Extract userId and expenseId using the utility function
        const { userId, expenseId } = extractIds(event);

        // Parse the JSON body to get the fields to update
        const { description, amount, date, category } = JSON.parse(event.body);

        // Initialize variables for the update expression
        let updateExpression = 'SET ';
        let expressionAttributeValues = {};
        let expressionAttributeNames = {};

        // Dynamically build the update expression based on the provided fields
        if (description) {
            updateExpression += 'description = :description, ';
            expressionAttributeValues[':description'] = description;
        }
        if (amount) {
            updateExpression += 'amount = :amount, ';
            expressionAttributeValues[':amount'] = amount;
        }
        if (date) {
            updateExpression += '#date = :date, ';
            expressionAttributeValues[':date'] = date;
            expressionAttributeNames['#date'] = 'date'; // Use #date for reserved word
        }
        if (category) {
            updateExpression += 'category = :category, ';
            expressionAttributeValues[':category'] = category;
        }

        // Remove trailing comma and space from the UpdateExpression
        updateExpression = updateExpression.slice(0, -2);

        // Construct the params object
        const params = {
            TableName: 'Expenses',
            Key: { userId, expenseId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };

        // Include ExpressionAttributeNames only if it's not empty
        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        // Update the item in DynamoDB
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Expense updated successfully',
                updatedExpense: result.Attributes,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.message.includes('Unauthorized') ? 401 : 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};