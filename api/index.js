// ============================================================
// LubriExpert AI — Vercel Serverless Function Handler
// ============================================================
// Loads the compiled Express application from backend/dist/app.
// Vercel serverless runtime automatically invokes this handler for
// all /api/* requests.
// ============================================================

const { createApp } = require('../backend/dist/app');

// Initialize the Express app singleton
const app = createApp();

module.exports = app;
