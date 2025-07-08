const serverless = require('serverless-http');

// Import the serverless Express app
const { initializeApp } = require('../../dist/serverless.js');

let app;

// Netlify function handler
exports.handler = async (event, context) => {
  if (!app) {
    app = await initializeApp();
  }
  
  const handler = serverless(app);
  return handler(event, context);
};