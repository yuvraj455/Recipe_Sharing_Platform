const passport = require('passport'); // Import Passport for authentication
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy for email/password authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import GoogleStrategy for Google OAuth authentication
const User = require('../models/User'); // Import the User model to interact with the user data in the database

// LocalStrategy for email and password authentication
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Specify that the username field in the request body is 'email'
  async (email, password, done) => {
    try {
      // Check if the user exists by email
      const user = await User.findOne({ email });
      if (!user) {
        // If no user is found, return an error message
        return done(null, false, { message: 'Incorrect email.' });
      }
      // Compare the provided password with the user's stored password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // If passwords don't match, return an error message
        return done(null, false, { message: 'Incorrect password.' });
      }
      // If authentication is successful, return the user object
      return done(null, user);
    } catch (error) {
      // Catch any errors and pass them to the done callback
      return done(error);
    }
  }
));

// GoogleStrategy for Google OAuth authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
    callbackURL: "https://recipe-sharing-platform-av3r.onrender.com/auth/google/callback" // URL for the callback after Google authentication
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Try to find an existing user either by Google ID or email address
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
      if (user) {
        // If user exists, check if the Google ID is set and update if necessary
        if (!user.googleId) {
          user.googleId = profile.id; // Set Google ID if not already present
          await user.save(); // Save the updated user data
        }
        return done(null, user); // Return the user object if they already exist
      } else {
        // If the user doesn't exist, create a new user with the profile data from Google
        user = new User({
          googleId: profile.id, // Store the Google ID
          name: profile.displayName, // Store the user's display name from Google
          email: profile.emails[0].value, // Store the user's email address
          username: profile.emails[0].value.split('@')[0] // Use the part of the email before '@' as the username
        });
        await user.save(); // Save the new user to the database
        return done(null, user); // Return the newly created user
      }
    } catch (error) {
      console.error('Error in Google strategy:', error); // Log any errors that occur during the process
      return done(error); // Pass the error to the done callback
    }
  }
));

// Serialize user to store user information in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});

// Deserialize user to retrieve user information from the session
passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve the user from the database by their ID
    const user = await User.findById(id);
    done(null, user); // Return the user object to the session
  } catch (error) {
    done(error); // If an error occurs, pass it to the done callback
  }
});

// Export the configured passport module for use in other parts of the app
module.exports = passport;
