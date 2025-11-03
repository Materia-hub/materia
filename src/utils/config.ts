/**
 * Configuration file for Materia app
 * Control debug features and app behavior
 */

// Set to false before deploying to production to hide all debug tools
export const DEBUG_MODE = false;

// Individual debug feature toggles (only work if DEBUG_MODE is true)
export const SHOW_DEPLOYMENT_STATUS = false;
export const SHOW_BACKEND_CHECKER = false;
export const SHOW_DEPLOYMENT_INSTRUCTIONS = false;
export const SHOW_LISTING_DEBUGGER = false;
export const ENABLE_CONSOLE_LOGS = false;

// App configuration
export const APP_NAME = 'Materia';
export const FREE_LISTING_LIMIT = 10;
export const LISTING_PRICE = 0.99;
export const ANNUAL_SUBSCRIPTION_PRICE = 20;
