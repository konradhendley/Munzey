const AWS = require('aws-sdk');
const { deleteExpense } = require('../functions/manageExpenses');

// Mock the DocumentClient's get and delete methods
jest.mock('aws-sdk', () => {
    const mockDynamoDb = {
        get: jest.fn(),
        delete: jest.fn(),
    };

    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mockDynamoDb),
        },
    };
});

describe('deleteExpense handler', () => {
    let mockDynamoDb;

    beforeEach(() => {
        mockDynamoDb = new AWS.DynamoDB.DocumentClient();

        // Mock the get function to return an existing expense
        mockDynamoDb.get.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Item: { userId: '123', expenseId: '456' }, // Expense exists
            }),
        });

        // Mock the delete function to simulate successful deletion
        mockDynamoDb.delete.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });

    it('should delete an expense successfully', async () => {
        const event = {
            requestContext: {
                authorizer: {
                    jwt: {
                        claims: { sub: '123' }
                    }
                }
            },
            pathParameters: {
                expenseId: '456'
            },
        };
        const response = await deleteExpense(event);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Expense deleted successfully',
        });

        expect(mockDynamoDb.delete).toHaveBeenCalledWith({
            TableName: 'Expenses',
            Key: { userId: '123', expenseId: '456' },
        });
    });

    it('should return 404 if expense not found', async () => {
        // Mock get to return no item
        mockDynamoDb.get.mockReturnValueOnce({
            promise: jest.fn().mockResolvedValue({
                Item: null, 
            }),
        });

        const event = {
            requestContext: {
                authorizer: {
                    jwt: {
                        claims: { sub: '123' }
                    }
                }
            },
            pathParameters: {
                expenseId: '456'
            }
        };

        const response = await deleteExpense(event);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Expense not found or does not belong to the user',
        });
    });

    it('should return 500 for unexpected errors', async () => {
        // Simulate an error during delete
        mockDynamoDb.delete.mockReturnValueOnce({
            promise: jest.fn().mockRejectedValue(new Error('Unexpected error')),
        });

        const event = {
            requestContext: {
                authorizer: {
                    jwt: {
                        claims: { sub: '123' }
                    }
                }
            },
            pathParameters: {
                expenseId: '456'
            }
        };

        const response = await deleteExpense(event);

        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Unexpected error',
        });
    });
});