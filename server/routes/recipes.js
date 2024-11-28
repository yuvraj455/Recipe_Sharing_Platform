const express = require('express');
const multer = require('multer');
const path = require('path');
const Recipe = require('../models/Recipe');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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
    const { title, ingredients, instructions, youtubeLink } = req.body;
    const recipe = new Recipe({
      title,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions,
      youtubeLink,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      author: req.user.id
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
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
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
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
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user.id });
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