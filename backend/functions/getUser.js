const { CognitoIdentityProviderClient, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { extractUsername } = require('./extractIds');

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

exports.handler = async (event) => {

  try {
    // Extract username from token claims
    const username = extractUsername(event);

    // Prepare command
    const command = new AdminGetUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    });

    // Send request to Cognito
    const response = await client.send(command);

    // Transform response into a readable format
    const userAttributes = response.UserAttributes.reduce((acc, attribute) => {
      acc[attribute.Name] = attribute.Value;
      return acc;
    }, {});

    return {
      statusCode: 200,
      body: JSON.stringify({
        username: response.Username,
        userStatus: response.UserStatus,
        attributes: userAttributes,
      }),
    };
  } catch (err) {
    console.error('Error fetching user details:', err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};