//Only extract the user id
exports.extractUserId = (event) => {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
        throw new Error('Unauthorized: Missing user ID in claims');
    }
    return userId;
};

// Extract the username
exports.extractUsername = (event) => {
    const username = event.requestContext?.authorizer?.jwt?.claims?.username;
    if (!username) {
        throw new Error('Unauthorized: Missing username in claims');
    }
    return username;
};

//extract both user and expense id
exports.extractIds = (event) => {
    const userId = exports.extractUserId(event);
    const expenseId = event.pathParameters?.id;

    if (!expenseId) {
        throw new Error('Invalid request: Missing expenseId');
    }

    return { userId, expenseId };
};