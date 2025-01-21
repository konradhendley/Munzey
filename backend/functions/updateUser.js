const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { extractUsername } = require('./extractIds');


// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  const username = extractUsername(event);
  const attributes = JSON.parse(event.body);
  
  try {
    // Validate attributes
    if (!attributes) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input: attributes are required.'}),
      };
    }

  // Validate username
  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input: username is required.' }),
    };
  }

    // Format attributes for Cognito
    const userAttributes = Object.keys(attributes).map((key) => ({
      Name: key, // Cognito attribute name, e.g., 'email', 'phone_number'
      Value: attributes[key], // New value for the attribute
    }));

    // Prepare command
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.USER_POOL_ID, 
      Username: username,
      UserAttributes: userAttributes,
    });

    // Send request to Cognito
    await client.send(command);

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User attributes updated successfully.' }),
    };
  } catch (err) {
    console.error('Error updating user attributes:', err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};