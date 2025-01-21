const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  try {
    // Extract userId
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized: Missing user ID in claims' }),
      };
    }

    // Define the params for deleting a user from Cognito
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
    };

    // Call the deleteUser API of Cognito
    await cognito.adminDeleteUser(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User account deleted successfully.' }),
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete user account.' }),
    };
  }
};