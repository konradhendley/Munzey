//Only extract the user id
exports.extractUserId = (event) => {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
        throw new Error('Unauthorized: Missing user ID in claims');
    }
    return userId;
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