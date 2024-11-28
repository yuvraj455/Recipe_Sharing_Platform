const express = require('express'); // Import express for creating the router
const multer = require('multer'); // Import multer for handling file uploads
const path = require('path'); // Import path for working with file paths
const Recipe = require('../models/Recipe'); // Import the Recipe model to interact with the recipes in the database
const authenticate = require('../middleware/authenticate'); // Import the authentication middleware

const router = express.Router(); // Create a new router instance

// Set up multer for handling file uploads (storing images)
const storage = multer.diskStorage({
  // Define where to store the uploaded files (uploads directory)
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // Define the filename using the current timestamp to avoid filename collisions
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Append the file extension
  }
});

const upload = multer({ storage: storage }); // Initialize multer with the specified storage configuration

// Get all recipes (public) with search functionality
router.get('/recipes', async (req, res) => {
  try {
    const { search } = req.query; // Extract search query from the request
    let query = {}; // Initialize the query object

    if (search) {
      // If search query is provided, build a query that searches in title, ingredients, and instructions
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } }, // Case-insensitive search for title
          { ingredients: { $regex: search, $options: 'i' } }, // Case-insensitive search for ingredients
          { instructions: { $regex: search, $options: 'i' } } // Case-insensitive search for instructions
        ]
      };
    }

    // Find recipes based on the query and populate the author field with the author's username and name
    const recipes = await Recipe.find(query).populate('author', 'username name');
    res.json(recipes); // Send the found recipes as a JSON response
  } catch (error) {
    console.error('Error fetching recipes:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching recipes', error: error.message }); // Send an error response
  }
});

// Get a single recipe (public)
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username name'); // Find a recipe by its ID and populate the author field
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' }); // If no recipe is found, return a 404 error
    }
    res.json(recipe); // Send the recipe data as a JSON response
  } catch (error) {
    console.error('Error fetching recipe:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching recipe', error: error.message }); // Send an error response
  }
});

// Create a new recipe (authenticated)
router.post('/recipes', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions, youtubeLink } = req.body; // Extract data from the request body

    // Create a new recipe object
    const recipe = new Recipe({
      title,
      ingredients: ingredients.split(',').map(item => item.trim()), // Split ingredients into an array and trim each item
      instructions,
      youtubeLink,
      image: req.file ? `/uploads/${req.file.filename}` : null, // If an image is uploaded, store the path
      author: req.user.id // Set the author of the recipe to the authenticated user's ID
    });

    await recipe.save(); // Save the new recipe to the database
    res.status(201).json(recipe); // Respond with the created recipe
  } catch (error) {
    console.error('Error creating recipe:', error); // Log any errors
    res.status(500).json({ message: 'Error creating recipe', error: error.message }); // Send an error response
  }
});

// Update a recipe (authenticated)
router.put('/recipes/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions, youtubeLink } = req.body; // Extract data from the request body
    const updateData = {
      title,
      ingredients: ingredients.split(',').map(item => item.trim()), // Split ingredients and trim
      instructions,
      youtubeLink
    };

    // If a new image is uploaded, update the image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Find and update the recipe by ID and check if the authenticated user is the author
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      updateData,
      { new: true } // Return the updated recipe
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' }); // If the recipe doesn't exist or the user is not the author, return an error
    }

    res.json(recipe); // Send the updated recipe
  } catch (error) {
    console.error('Error updating recipe:', error); // Log any errors
    res.status(500).json({ message: 'Error updating recipe', error: error.message }); // Send an error response
  }
});

// Delete a recipe (authenticated)
router.delete('/recipes/:id', authenticate, async (req, res) => {
  try {
    // Find and delete the recipe by ID, ensuring the user is the author
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' }); // If the recipe doesn't exist or the user is not the author, return an error
    }
    res.json({ message: 'Recipe deleted successfully' }); // Send a success message if the recipe is deleted
  } catch (error) {
    console.error('Error deleting recipe:', error); // Log any errors
    res.status(500).json({ message: 'Error deleting recipe', error: error.message }); // Send an error response
  }
});

module.exports = router; // Export the router to be used in other parts of the application
