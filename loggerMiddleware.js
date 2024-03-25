// loggerMiddleware.js

function loggerMiddleware(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next(); // Pass control to the next middleware function
  }
  
  module.exports = loggerMiddleware;
  