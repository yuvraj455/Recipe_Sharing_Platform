require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const { initializeStorage } = require('./config/storage');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Initialize Google Cloud Storage
initializeStorage();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/auth', authRoutes);
app.use('/api', recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

