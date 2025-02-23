// authUtils.js
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { config } from "../config";

let logoutTimer;

const userPool = new CognitoUserPool({
    UserPoolId: config.USER_POOL_ID,
    ClientId: config.CLIENT_ID,
});

/**
 * Resets the inactivity timer. Logs out user after 1 hour of inactivity.
 */
export const resetInactivityTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);

    logoutTimer = setTimeout(() => {
        console.warn("User inactive. Logging out...");
        handleLogout();
    },  60 * 60 * 1000); // 1 hour in milliseconds
};

/**
 * Logs out the user and redirects to the login page.
 */
export const handleLogout = () => {
    const user = userPool.getCurrentUser();
    if (user) {
        user.signOut();
    }
    localStorage.clear();
    window.location.href = "/";
};

/**
 * Checks if the access token is still valid.
 */
export const checkSession = () => {
    const user = userPool.getCurrentUser();
    if (!user) return; // Don't force logout if user is not signed in

    user.getSession((err, session) => {
        if (err || !session.isValid()) {
            handleLogout();
        }
    });
};

/**
 * Initializes authentication listeners to reset inactivity timer.
 */
export const initializeAuthListeners = () => {
    resetInactivityTimer();
    window.onload = resetInactivityTimer;
    window.onmousemove = resetInactivityTimer;
    window.onkeydown = resetInactivityTimer;
};