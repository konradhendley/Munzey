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
    const username = event.requestContext?.authorizer?.jwt?.claims?.username;
    if (!username) {
        throw new Error('Unauthorized: Missing username');
    }
    return username;
};

//extract both user and expense id
exports.extractIds = (event) => {
    const userId = event.userId;
    const expenseId = event.expenseId;

    if (!expenseId) {
        throw new Error('Invalid request: Missing expenseId');
    } else if (!userId) {
        throw new Error('Unauthorized: Missing userId');
    }

    return { userId, expenseId };
};