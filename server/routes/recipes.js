const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/googleCloudStorage');
const path = require('path');
const Recipe = require('../models/Recipe');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

// Helper function to upload file to Google Cloud Storage
const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
    }

    const blob = bucket.file(Date.now() + '_' + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

// Get all recipes (public) with search functionality
router.get('/recipes', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } },
          { instructions: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const recipes = await Recipe.find(query).populate('author', 'username name');
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Get a single recipe (public)
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

// Create a new recipe (authenticated)
router.post('/recipes', authenticate, upload.single('image'), async (req, res) => {
  try {
    console.log('Received recipe data:', req.body);
    console.log('Received file:', req.file);

    const { title, ingredients, instructions, youtubeLink } = req.body;
    let imageUrl = null;

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

    const recipe = new Recipe({
      title,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions,
      youtubeLink,
      image: imageUrl,
      author: req.user._id
    });

    console.log('Created recipe object:', recipe);

    await recipe.save();
    console.log('Recipe saved successfully');

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ 
      message: 'Error creating recipe', 
      error: error.message,
      details: error.stack
    });
  }
});

// Update a recipe (authenticated)
router.put('/recipes/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions, youtubeLink } = req.body;
    const updateData = {
      title,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions,
      youtubeLink
    };

    if (req.file) {
      updateData.image = await uploadToGCS(req.file);
    }

    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      updateData,
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
});

// Delete a recipe (authenticated)
router.delete('/recipes/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not the author' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
});

module.exports = router;

