require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import express for handling HTTP requests
const mongoose = require('mongoose'); // Import mongoose for interacting with MongoDB
const cors = require('cors'); // Import CORS for enabling cross-origin requests
const passport = require('./config/passport'); // Import passport for authentication
const authRoutes = require('./routes/auth'); // Import authentication-related routes
const recipeRoutes = require('./routes/recipes'); // Import recipe-related routes
const path = require('path'); // Import path for working with file paths

const app = express(); // Create an instance of the express application

// Middleware setup
app.use(cors()); // Enable cross-origin requests to the server
app.use(express.json()); // Middleware to parse JSON bodies in incoming requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(passport.initialize()); // Initialize passport for handling authentication

// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB')) // Log success message
  .catch(err => console.error('MongoDB connection error:', err)); // Log error if connection fails

// Define routes for authentication and recipe APIs
app.use('/auth', authRoutes); // Handle authentication-related routes under '/auth'
app.use('/api', recipeRoutes); // Handle recipe-related routes under '/api'

// Error handling middleware for catching errors in the application
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ message: 'Something went wrong!', error: err.message }); // Send a generic error message with the error details
});

// Set the port for the server to listen on (from environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log a message when the server starts
