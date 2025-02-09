const { handler: addExpense } = require('../functions/addExpense');
const AWS = require('aws-sdk');

// Mock extractUserId to return a fake user ID
jest.mock('../functions/extractIds', () => ({
  extractUserId: jest.fn(() => 'mocked-user-id'),
}));

// Mock AWS SDK DynamoDB DocumentClient properly
jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          put: jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
          }),
        };
      }),
    },
  };
});

describe('addExpense function', () => {

  it('should successfully add an expense and return 201 status', async () => {
    const mockEvent = {
      body: JSON.stringify({
        amount: 100,
        description: 'Groceries',
        date: '2025-02-07',
        category: 'Food',
      }),
    };

    const response = await addExpense(mockEvent);
    
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Expense added successfully');
  });

  it('should return 400 if required fields are missing', async () => {
    const mockEvent = {
      body: JSON.stringify({
        description: 'Groceries',
        date: '2025-02-07',
      }), // Missing "amount"
    };

    const response = await addExpense(mockEvent);
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'Missing required fields: amount, description, or date');
  });


  /*
  it('should return 500 if DynamoDB fails', async () => {
    // Mock the DynamoDB put method to reject with an error
    const mockPut = jest.fn().mockRejectedValue(new Error('DynamoDB error'));
    AWS.DynamoDB.DocumentClient.mockImplementation(() => ({
      put: mockPut,
    }));
  
    const mockEvent = {
      body: JSON.stringify({
        amount: 100,
        description: 'Groceries',
        date: '2025-02-07',
        category: 'Food',
      }),
    };
  
    const response = await addExpense(mockEvent);
  
    // Ensure the mockPut method was called
    expect(mockPut).toHaveBeenCalled();
  
    // Ensure DynamoDB failure is handled and response statusCode is 500
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toHaveProperty('message', 'DynamoDB error');
  });
  */
});