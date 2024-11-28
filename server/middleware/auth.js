const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to work with JWT tokens

module.exports = function(req, res, next) {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token from the Authorization header, removing 'Bearer ' prefix

  // Check if no token is provided
  if (!token) {
    // If no token is found, send a 401 status with an error message
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the provided token
  try {
    // jwt.verify() verifies the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If the token is valid, extract the user ID from the decoded payload and attach it to the request object
    req.user = { id: decoded.id }; // Change this line to set the user object with the decoded ID
    
    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (err) {
    // If there's an error verifying the token, send a 401 status with an error message
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
