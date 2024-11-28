const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT tokens
const User = require('../models/User'); // Import the User model to query the database for user details

// Middleware function to authenticate a user using JWT token
const authenticate = async (req, res, next) => {
  try {
    // Step 1: Extract the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', ''); // Extract token by removing the 'Bearer ' prefix

    // Step 2: Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get user ID and verify its validity

    // Step 3: Find the user associated with the decoded token's user ID
    const user = await User.findOne({ _id: decoded.id }); // Query the User collection to find the user by their ID

    // Step 4: Handle case where the user is not found
    if (!user) {
      throw new Error(); // If user is not found, throw an error
    }

    // Step 5: Attach token and user information to the request object for later use
    req.token = token; // Store the token in the request object
    req.user = user;   // Store the user object in the request object

    // Step 6: Proceed to the next middleware or route handler
    next(); // Move on to the next middleware or route handler
  } catch (error) {
    // If any error occurs (e.g., token is invalid, user not found), send a 401 Unauthorized response
    res.status(401).send({ error: 'Please authenticate.' }); // Inform the client that authentication failed
  }
};

module.exports = authenticate; // Export the authenticate middleware to be used in routes
