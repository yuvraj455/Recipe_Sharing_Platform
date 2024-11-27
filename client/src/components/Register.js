import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

function Register({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://recipe-sharing-platform-av3r.onrender.com/auth/register', {
        username,
        email,
        password,
      });

      // Save token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);

      // Update authentication state
      setIsAuthenticated(true);

      // Navigate to recipes page
      navigate('/recipes');
    } catch (error) {
      console.error('Registration error:', error);

      // Handle error messages
      if (error.response) {
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
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
        backgroundColor: '#fff7e6', // Body background color
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: '#fafafa', // Off-white background color for the container
          padding: 4, // Add some padding inside the container
          borderRadius: 2, // Rounded corners for the container
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Box shadow for the container
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
              '&:hover': {
                backgroundColor: '#004d47', // Hover effect color
              },
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default Register;
