import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the authentication token
    localStorage.removeItem('userId'); // Remove the stored user ID
    setIsAuthenticated(false); // Update authentication state
    navigate('/'); // Redirect to the homepage
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#004d47', // Set background color
        boxShadow: 'none', // Remove default shadow
        fontFamily: '"Roboto", sans-serif', // Use Roboto font
      }}
    >
      <Toolbar>
        {/* Logo and Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="https://www.yummyrecipe.co/yummy-logo-fb.jpg" // Logo URL
            alt="Recipe Sharing Logo"
            sx={{
              width: '40px', // Logo width
              height: '40px', // Logo height
              marginRight: '10px', // Space between logo and text
            }}
          />
          <Typography
            variant="h6"
            component={Link} // Make the title a clickable link
            to="/"
            sx={{
              textDecoration: 'none', // Remove underline
              color: '#fff', // White text color
              fontFamily: '"Lora", serif', // Use Lora font for title
              fontWeight: 'bold', // Bold font weight
              '&:hover': {
                color: '#ff7043', // Change color on hover
              },
            }}
          >
            Recipe Sharing
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ marginLeft: 'auto' }}> {/* Push navigation buttons to the right */}
          {/* Home Button */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: '#fff', // White text color
              fontFamily: '"Roboto", sans-serif', // Font styling
              fontWeight: 'bold',
              '&:hover': {
                color: '#ff7043', // Change text color on hover
                backgroundColor: 'transparent', // No background color on hover
              },
            }}
          >
            Home
          </Button>

          {/* All Recipes Button */}
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
              {/* Add Recipe Button for Authenticated Users */}
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

              {/* Logout Button */}
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
              {/* Login Button for Unauthenticated Users */}
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

              {/* Register Button for Unauthenticated Users */}
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
