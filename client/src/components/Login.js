import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Box, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/recipes');
    } else if (errorParam) {
      setError('Authentication failed. Please try again.');
    }
  }, [location, navigate, setIsAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://recipe-sharing-platform-av3r.onrender.com/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      navigate('/recipes');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error', error);
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
        backgroundColor: '#fff7e6',
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      
      <Button
        href="https://recipe-sharing-platform-av3r.onrender.com/auth/google"
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login with Google
      </Button>
    </Container>
    </Box>
  );
}

export default Login;

