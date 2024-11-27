import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#004d47', boxShadow: 'none', fontFamily: '"Roboto", sans-serif' }}>
      <Toolbar>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="https://www.yummyrecipe.co/yummy-logo-fb.jpg"
            alt="Recipe Sharing Logo"
            sx={{
              width: '40px', // Adjust the size of the logo
              height: '40px',
              marginRight: '10px', // Adds space between logo and text
            }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: '#fff',
              fontFamily: '"Lora", serif',
              fontWeight: 'bold',
              '&:hover': {
                color: '#ff7043',
              },
            }}
          >
            Recipe Sharing
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ marginLeft: 'auto' }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                color: '#ff7043',
                backgroundColor: 'transparent',
              },
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/recipes"
            sx={{
              color: '#fff',
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 'bold',
              '&:hover': {
                color: '#ff7043',
                backgroundColor: 'transparent',
              },
            }}
          >
            All Recipes
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/recipes/new"
                sx={{
                  color: '#fff',
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#ff7043',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Add Recipe
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  color: '#fff',
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#ff7043',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{
                  color: '#fff',
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#ff7043',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{
                  color: '#fff',
                  fontFamily: '"Roboto", sans-serif',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: '#ff7043',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
