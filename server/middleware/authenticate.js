// Importing required modules: jsonwebtoken for JWT handling and User model for database operations
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to authenticate the user based on JWT token
const authenticate = async (req, res, next) => {
  try {
    // Extracting the token from the 'Authorization' header
    const token = req.header('Authorization').replace('Bearer ', ''); // Removing 'Bearer ' prefix from the token

    // Verifying the token using JWT secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes the token and extracts the payload

    // Looking for the user associated with the decoded token's ID in the database
    const user = await User.findOne({ _id: decoded.id }); // Fetching the user by their ID

    // If the user is not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Attaching the token and user data to the request object for use in subsequent middlewares or route handlers
    req.token = token;
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catching errors and logging them to the console
    console.error('Authentication error:', error);

    // Sending a 401 Unauthorized status code along with the error message as JSON response
    res.status(401).json({
      error: 'Please authenticate.', // General error message
      details: error.message // Specific details of the error that occurred
    });
  }
};

// Exporting the authenticate middleware to be used in route handlers
module.exports = authenticate;
