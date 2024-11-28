import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

function Register({ setIsAuthenticated }) {
  // State variables to manage form inputs, error messages, loading state, etc.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useNavigate hook to programmatically navigate to different pages
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any existing errors
    setLoading(true); // Set loading state to true when starting the request

    try {
      // Send POST request to register the user
      const response = await axios.post('https://recipe-sharing-platform-av3r.onrender.com/auth/register', {
        username,
        email,
        password,
      });

      // Save the token and user info in localStorage to persist user session
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);

      // Update the authentication state
      setIsAuthenticated(true);

      // Navigate to the recipes page after successful registration
      navigate('/recipes');
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different types of errors and set appropriate error messages
      if (error.response) {
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3B4MTM2OTgxMy1pbWFnZS1rd3Z4eHA5MS5qcGc.jpg')`, // Background image
        backgroundSize: 'cover', // Ensures the image covers the whole area
        backgroundPosition: 'center', // Centers the background image
        backgroundRepeat: 'no-repeat', // Prevents tiling of the background image
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: '#FFFFF0', // Light yellow background for the form container
          padding: '50px', // Padding inside the container
          borderRadius: '20px', // Adds curved edges to the form container
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Adds a black shadow for a floating effect
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        
        {/* Show error message if there's an error */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
          
          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mt: 2, // Margin top
              '&:hover': {
                backgroundColor: '#004d47', // Hover effect color
              },
            }}
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Registering...' : 'Register'} {/* Display 'Registering...' while loading */}
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default Register;
