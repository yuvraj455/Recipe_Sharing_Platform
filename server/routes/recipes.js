const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/storage');
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

// Create a new recipe (authenticated)
router.post('/recipes', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions, youtubeLink } = req.body;

    let imageUrl = null;
    if (req.file) {
      const blob = bucket.file(`recipes/${Date.now()}_${req.file.originalname}`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error('Error uploading to Google Cloud Storage:', err);
        res.status(500).json({ message: 'Error uploading image', error: err.message });
      });

      blobStream.on('finish', async () => {
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        
        const recipe = new Recipe({
          title,
          ingredients: ingredients.split(',').map(item => item.trim()),
          instructions,
          youtubeLink,
          image: imageUrl,
          author: req.user.id
        });

        await recipe.save();
        res.status(201).json(recipe);
      });

      blobStream.end(req.file.buffer);
    } else {
      const recipe = new Recipe({
        title,
        ingredients: ingredients.split(',').map(item => item.trim()),
        instructions,
        youtubeLink,
        author: req.user.id
      });

      await recipe.save();
      res.status(201).json(recipe);
    }
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
      const blob = bucket.file(`recipes/${Date.now()}_${req.file.originalname}`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error('Error uploading to Google Cloud Storage:', err);
        res.status(500).json({ message: 'Error uploading image', error: err.message });
      });

      blobStream.on('finish', async () => {
        updateData.image = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        
        const recipe = await Recipe.findOneAndUpdate(
          { _id: req.params.id, author: req.user.id },
          updateData,
          { new: true }
        );

        if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found or you are not the author' });
        }

        res.json(recipe);
      });

      blobStream.end(req.file.buffer);
    } else {
      const recipe = await Recipe.findOneAndUpdate(
        { _id: req.params.id, author: req.user.id },
        updateData,
        { new: true }
      );

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found or you are not the author' });
      }

      res.json(recipe);
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
});

module.exports = router;

