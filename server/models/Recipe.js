// Importing mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Defining the schema for the Recipe model
const recipeSchema = new mongoose.Schema({
  // 'title' field: Required string for the recipe's title
  title: { type: String, required: true },

  // 'ingredients' field: An array of strings to hold the recipe's ingredients
  ingredients: [String],

  // 'instructions' field: A string for the recipe's cooking instructions
  instructions: String,

  // 'image' field: A string to store the image URL or path related to the recipe
  image: String,

  // 'youtubeLink' field: A string to store the YouTube link (if any) related to the recipe
  youtubeLink: String,

  // 'author' field: A reference to the 'User' model, representing the user who created the recipe
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 'createdAt' field: Date when the recipe was created, with a default value of the current date and time
  createdAt: { type: Date, default: Date.now }
});

// Exporting the Recipe model to interact with the recipes collection in the database
module.exports = mongoose.model('Recipe', recipeSchema);
