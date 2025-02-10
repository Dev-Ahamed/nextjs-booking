/**
 * An array of routes that are accessible to the public
 * These routes do not require Authentication
 * @type {string[]}
 */

export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to settings
 * @type {string[]}
 */

export const authRoutes = ["/login", "/signup"];

/**
 * The prefix for API authentiction routes
 * Routes that starts with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/";
