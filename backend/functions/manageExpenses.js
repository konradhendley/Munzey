const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { extractUserId, extractIds } = require('./extractIds');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

//////////////////////////////Add Expenses//////////////////////////////
const addExpense = async (event) => {
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

//////////////////////////////Update Expenses//////////////////////////////
const updateExpense = async (event) => {
    try {
        // Extract userId and expenseId using the utility function
        const { userId, expenseId } = extractIds(event);

                // Parse the JSON body to get the fields to update
                const rawBody = event.event?.body; // Adjusted for the nested structure

                if (!rawBody) {
                    throw new Error("Body is missing from event");
                }
        
                const { description, amount, date, category } = JSON.parse(rawBody);

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


//////////////////////////////Delete Expenses//////////////////////////////
const deleteExpense = async (event) => {
    try {
        // Extract userId and expenseId
        const { userId, expenseId } = extractIds(event);

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

//////////////////////////////Get Expense (singular)//////////////////////////////
const getExpense = async (event) => {
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

//////////////////////////////Get Expenses (plural)//////////////////////////////
const getExpenses = async (event) => {
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
            IndexName: 'userId-index',
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

// Export functions
module.exports = {
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getExpenses,
    handler: async (event) => {
        try {
            const httpMethod = event.requestContext.http.method;
            const path = event.requestContext.http.path;
            const userId = event.requestContext?.authorizer?.jwt?.claims?.sub

            // Check if pathParameters exists and is not empty
            const expenseId = event.pathParameters && Object.keys(event.pathParameters).length > 0 
            ? event.pathParameters.id 
            : null;

            if (httpMethod === "POST" && path.includes("expense")) {
                return await addExpense(event);
            } else if (httpMethod === "PATCH" && path.includes("expense")) {
                return await updateExpense({event, expenseId: event.pathParameters.id, userId});
            } else if (httpMethod === "DELETE" && path.includes("expense")) {
                return await deleteExpense({event, expenseId: event.pathParameters.id, userId});
            } else if (httpMethod === "GET" && path.includes("expense") && event.pathParameters) {
                return await getExpense({ event, expenseId: event.pathParameters.id, userId });
            } else if (httpMethod === "GET" && path.includes("expenses")) {
                return await getExpenses(event);
            }

            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid request" }),
            };
        } catch (error) {
            console.error("Error processing request:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error", error }),
            };
        }
    }
};