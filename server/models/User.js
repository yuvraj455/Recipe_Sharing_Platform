const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB
const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords

// Define the schema for the 'User' model
const userSchema = new mongoose.Schema({
  // Username is a required field
  username: { type: String, required: true },

  // Email is a required field and must be unique
  email: { type: String, required: true, unique: true },

  // Password is an optional field, but it's required if the user is registering with a password (not Google)
  password: { type: String, required: false },

  // googleId is used to store the user's Google ID if they use Google OAuth
  googleId: String,

  // Full name of the user (optional)
  name: String
});

// Pre-save middleware to hash the password before saving the user document to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it's being modified or newly set
  if (this.isModified('password')) {
    // Hash the password using bcrypt with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
  }
  next(); // Proceed with saving the document
});

// Method to compare passwords during login or authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Compare the provided password with the hashed password in the database
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model so it can be used in other parts of the application
module.exports = mongoose.model('User', userSchema);
