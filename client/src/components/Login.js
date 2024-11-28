import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  // State variables to manage user input and error messages
  const [email, setEmail] = useState(''); // Stores the user's email input
  const [password, setPassword] = useState(''); // Stores the user's password input
  const [error, setError] = useState(''); // Stores error messages, if any
  const navigate = useNavigate(); // Navigation hook to redirect users after login

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // API call to authenticate the user
      const response = await axios.post('https://recipe-sharing-platform-av3r.onrender.com/auth/login', { email, password });
      // Save the authentication token and user ID in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      setIsAuthenticated(true); // Update authentication state in the app
      navigate('/recipes'); // Redirect to the recipes page on successful login
    } catch (error) {
      // Handle errors, e.g., incorrect credentials
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex', // Flexbox layout for centering
        flexDirection: 'column', // Stack items vertically
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3B4MTM2OTgxMy1pbWFnZS1rd3Z4eHA5MS5qcGc.jpg')`,
        backgroundSize: 'cover', // Make the background image cover the full container
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Prevent image repetition
        minHeight: '100vh', // Full viewport height
        padding: 0, // Remove padding for cleaner layout
      }}
    >
      <Container
        maxWidth="xs" // Restrict container width for compact layout
        sx={{
          backgroundColor: '#FFFFF0', // Light beige background
          padding: '50px', // Internal padding for spacing
          borderRadius: '20px', // Rounded corners for a modern look
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Soft shadow for depth
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {/* Display error messages if present */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email" // Input field for email
            type="email"
            fullWidth
            margin="normal" // Add vertical spacing
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
            required // Mark field as mandatory
          />
          <TextField
            label="Password" // Input field for password
            type="password"
            fullWidth
            margin="normal" // Add vertical spacing
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
            required // Mark field as mandatory
          />
          <Button
            type="submit" // Button to submit the form
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2, // Add margin-top
              '&:hover': {
                backgroundColor: '#004d47', // Change button color on hover
              },
            }}
          >
            Login
          </Button>
        </form>

        {/* Google Login Button */}
        <Button
          href="https://recipe-sharing-platform-av3r.onrender.com/auth/google" // Redirect to Google login
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            mt: 2, // Add margin-top
            '&:hover': {
              backgroundColor: '#004d47', // Change button color on hover
            },
          }}
        >
          Login with Google
        </Button>
      </Container>
    </Box>
  );
}

export default Login;
