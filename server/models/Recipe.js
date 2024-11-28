const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB

// Define the schema for the 'Recipe' model
const recipeSchema = new mongoose.Schema({
  // Title of the recipe, required field
  title: { type: String, required: true },

  // Ingredients is an array of strings, where each ingredient is a string
  ingredients: [String],

  // Instructions for preparing the recipe, stored as a string
  instructions: String,

  // Image URL for the recipe (optional), stored as a string
  image: String,

  // Optional YouTube link to a video tutorial for the recipe
  youtubeLink: String,

  // The author of the recipe, which references the 'User' model
  // This will store the ObjectId of the user who created the recipe
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // The date the recipe was created, defaults to the current date
  createdAt: { type: Date, default: Date.now }
});

// Export the Recipe model, so it can be used in other parts of the application
module.exports = mongoose.model('Recipe', recipeSchema);
