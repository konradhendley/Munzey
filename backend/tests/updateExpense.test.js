const AWS = require('aws-sdk');
const { updateExpense } = require('../functions/manageExpenses');

// Mock the DocumentClient's update method
jest.mock('aws-sdk', () => {
    const mockDynamoDb = {
        get: jest.fn(),
        update: jest.fn(),
    };

    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mockDynamoDb),
        },
    };
});

describe('updateExpense handler', () => {
    let mockDynamoDb;

    beforeEach(() => {
        mockDynamoDb = new AWS.DynamoDB.DocumentClient();

        // Mock the get function to return an existing expense with amount = 250
        mockDynamoDb.get.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Item: { userId: '123', expenseId: '456', amount: 250 },
            }),
        });

         // Mock the update function to return the updated expense with amount = 50
        mockDynamoDb.update.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Attributes: {
                    userId: '123',
                    expenseId: '456',
                    description: 'Updated Expense',
                    amount: 50,
                    date: '2024-02-08',
                    category: 'Food',
                },
            }),
        });
    });

    it('should update an expense successfully', async () => {
        const event = {
            requestContext: {
                authorizer: {
                    jwt: {
                        claims: { sub: '123' }
                    }
                }
            },
            pathParameters: {
                id: '456'
            },
            body: JSON.stringify({
                amount: 50,
                description: 'Updated Expense',
                category: 'Food',
                date: '2024-02-08'
            })
        };

        const response = await updateExpense(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Expense updated successfully',
            updatedExpense: {
                userId: '123',
                expenseId: '456',
                description: 'Updated Expense',
                amount: 50,
                date: '2024-02-08',
                category: 'Food',
            },
        });

        expect(mockDynamoDb.update).toHaveBeenCalledWith({
            TableName: 'Expenses',
            Key: { userId: '123', expenseId: '456' },
            UpdateExpression: 'SET description = :description, amount = :amount, #date = :date, category = :category',
            ExpressionAttributeValues: {
                ':description': 'Updated Expense',
                ':amount': 50,
                ':date': '2024-02-08',
                ':category': 'Food',
            },
            ExpressionAttributeNames: { '#date': 'date' },
            ReturnValues: 'ALL_NEW',
        });
    });
});