//Only extract the user id
exports.extractUserId = (event) => {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
        throw new Error('Unauthorized: Missing userId');
    }
    return userId;
};

// Extract the username
exports.extractUsername = (event) => {
    const username = event.username;
    if (!username) {
        throw new Error('Unauthorized: Missing username');
    }
    return username;
};

//extract both user and expense id
exports.extractIds = (event) => {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    const expenseId = event.pathParameters.id;
    console.log("the event for extractIDs: ", event);

    if (!expenseId) {
        throw new Error('Invalid request: Missing expenseId');
    } else if (!userId) {
        throw new Error('Unauthorized: Missing userId');
    }

    return { userId, expenseId };
};