const AWS = require('aws-sdk');
const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const cognito = new AWS.CognitoIdentityServiceProvider();
const { extractUsername } = require('./extractIds');

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

//////////////////////////////Update Users//////////////////////////////
const updateUser = async (event) => {
  const username = extractUsername(event);
  console.log("event: ", event)
  const rawAttributes = event.event?.body;
  const attributes = JSON.parse(rawAttributes);
  
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

//////////////////////////////Delete Users//////////////////////////////
const deleteUser = async (event) => {
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

//////////////////////////////Get Users//////////////////////////////
const getUser = async (event) => {

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

// Export functions
module.exports = {
   updateUser,
   deleteUser,
   getUser,
   handler: async (event) => {
    try {
        const httpMethod = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub
        const username = event.requestContext?.authorizer?.jwt?.claims?.username;
        console.log("event", event);

       if (httpMethod === "PATCH" && path.includes("user")) {
            return await updateUser({event, userId, username});
        } else if (httpMethod === "DELETE" && path.includes("user")) {
            return await deleteUser({event,  userId});
        } else if (httpMethod === "GET" && path.includes("user")) {
            return await getUser({ event, userId, username });
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