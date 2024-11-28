import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://recipe-sharing-platform-av3r.onrender.com/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      setIsAuthenticated(true);
      navigate('/recipes');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3B4MTM2OTgxMy1pbWFnZS1rd3Z4eHA5MS5qcGc.jpg')`,
        backgroundSize: 'cover', // Ensures the image covers the whole area
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents tiling
        minHeight: '100vh',
        padding: 0
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: '#FFFFF0',
          padding: '50px',
          borderRadius: '20px', // Adds curved edges
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Adds a black shadow
        }}
      >
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, '&:hover': {
                backgroundColor: '#004d47', // Hover effect color
              }, }}>
            Login
          </Button>
        </form>
        <Button
          href="https://recipe-sharing-platform-av3r.onrender.com/auth/google"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2, '&:hover': {
                backgroundColor: '#004d47', // Hover effect color
              }, }}
        >
          Login with Google
        </Button>
      </Container>
    </Box>
  );
}

export default Login;
