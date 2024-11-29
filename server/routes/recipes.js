// Importing required libraries and modules
const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/googleCloudStorage'); // Importing the GCS bucket configuration
const path = require('path');
const Recipe = require('../models/Recipe'); // Importing the Recipe model
const authenticate = require('../middleware/authenticate'); // Importing the authentication middleware

const router = express.Router(); // Initialize the Express Router

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Helper function to upload file to Google Cloud Storage
const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null); // If no file, resolve with null
    }

    // Creating a new file object in the GCS bucket
    const blob = bucket.file(Date.now() + '_' + file.originalname); 
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true, // Enable compression for the file
    });

    // Handling errors during the file upload process
    blobStream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      reject(err); // Reject the promise if an error occurs
    });

    // On successful upload, resolve the promise with the file's public URL
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer); // End the stream and upload the file buffer
  });
};

// Route to get all recipes (public) with search functionality
router.get('/recipes', async (req, res) => {
  try {
    const { search } = req.query; // Get search query from the request
    let query = {};

    // If a search query is provided, modify the query object to search in title, ingredients, and instructions
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } }, // Search in title, case insensitive
          { ingredients: { $regex: search, $options: 'i' } }, // Search in ingredients, case insensitive
          { instructions: { $regex: search, $options: 'i' } } // Search in instructions, case insensitive
        ]
      };
    }

    // Fetch recipes from the database with the search query and populate author details
    const recipes = await Recipe.find(query).populate('author', 'username name');
    res.json(recipes); // Return the list of recipes as JSON response
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Route to get a single recipe (public)
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe); // Return the recipe data as JSON response
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

// Route to create a new recipe (authenticated)
router.post('/recipes', authenticate, upload.single('image'), async (req, res) => {
  try {
    console.log('Received recipe data:', req.body);
    console.log('Received file:', req.file);

    // Destructure fields from the request body
    const { title, ingredients, instructions, youtubeLink } = req.body;
    let imageUrl = null;

    // If a file is uploaded, upload it to Google Cloud Storage
    if (req.file) {
      try {
        imageUrl = await uploadToGCS(req.file);
        console.log('Uploaded image URL:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading to GCS:', uploadError);
        return res.status(500).json({
          message: 'Error uploading image',
          error: uploadError.message,
          details: uploadError.stack
        });
      }
    }

    // Create a new recipe object
    const recipe = new Recipe({
      title,
      ingredients: ingredients.split(',').map(item => item.trim()), // Split and trim ingredients
      instructions,
      youtubeLink,
      image: imageUrl, // Use the uploaded image URL
      author: req.user._id // Associate the recipe with the authenticated user
    });

    console.log('Created recipe object:', recipe);

    // Save the recipe to the database
    await recipe.save();
    console.log('Recipe saved successfully');

    res.status(201).json(recipe); // Return the newly created recipe as JSON response
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({
      message: 'Error creating recipe',
      error: error.message,
      details: error.stack
    });
  }
});

// Route to update an existing recipe (authenticated)
router.put('/recipes/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions, youtubeLink } = req.body;
    const updateData = {
      title,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions,
      youtubeLink
    };

    // If a new image is uploaded, update the image field
    if (req.file) {
      updateData.image = await uploadToGCS(req.file);
    }

    // Find the recipe by ID and update it, ensuring the authenticated user is the author
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      updateData,
      { new: true } // Return the updated recipe
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' });
    }
    res.json(recipe); // Return the updated recipe as JSON response
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
});

// Route to delete a recipe (authenticated)
router.delete('/recipes/:id', authenticate, async (req, res) => {
  try {
    // Find and delete the recipe, ensuring the authenticated user is the author
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' });
    }
    res.json({ message: 'Recipe deleted successfully' }); // Return success message
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
});

module.exports = router; // Export the router to be used in other parts of the app
