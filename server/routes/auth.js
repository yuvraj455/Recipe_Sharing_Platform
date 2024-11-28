const express = require('express'); // Import express to create a router for the app
const passport = require('passport'); // Import passport for handling authentication
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating JWT tokens
const User = require('../models/User'); // Import the User model for interacting with the user data
const router = express.Router(); // Create an express router

// Local Login Route
router.post('/login', async (req, res, next) => {
  // Use passport to authenticate with the local strategy (username/password)
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err || !user) {
      // If there's an error or no user, send a failure response
      return res.status(400).json({
        message: info ? info.message : 'Login failed', // If info is provided by passport, send the message
        user: user, // Send user information (if available)
      });
    }

    // If authentication is successful, log the user in
    req.login(user, { session: false }, (err) => {
      if (err) {
        // If there's an error during the login process
        return res.status(500).json({ message: 'Error during login', error: err });
      }

      // Generate a JWT token for the user (valid for 1 day)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Return user details and token
      return res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token, // Send the generated token in the response
      });
    });
  })(req, res, next); // Call passport.authenticate with the current request, response, and next function
});

// Google Login Route
router.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }) // Start the Google OAuth authentication flow
);

// Google Callback Route
router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), // Handle the callback from Google OAuth
  (req, res) => {
    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Redirect the user to the front-end with the token and user ID in the query parameters
    res.redirect(`https://recipe-sharing-platform2.onrender.com/auth-callback?token=${token}&userId=${req.user._id}`);
  }
);

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Destructure username, email, and password from the request body

    // Check if a user already exists with the same username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // If the username or email already exists, send a specific error message
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // If the username and email are unique, create a new user
    const newUser = new User({ username, email, password });
    await newUser.save(); // Save the new user to the database

    // Generate a JWT token for the newly created user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Respond with a success message, user data, and the generated token
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error); // Log any errors that occur during registration
    res.status(500).json({ message: 'Error during registration', error: error.message }); // Send an error response
  }
});

module.exports = router; // Export the router to be used in other parts of the application
