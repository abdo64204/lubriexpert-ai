// ============================================================
// LubriExpert AI — Backend Serverless Entrypoint for Vercel
// ============================================================
// Used if backend is deployed as a standalone Vercel project
// with Root Directory set to 'backend'.
// ============================================================

const { createApp } = require('../dist/app');

const app = createApp();

module.exports = app;
