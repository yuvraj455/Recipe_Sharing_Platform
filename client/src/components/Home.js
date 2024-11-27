import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button } from '@mui/material';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90.7vh', // Full viewport height
        backgroundColor: '#fff7e6',
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '10px 6px 12px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff7e6',
            alignItems: 'center',
            height: '100%', // Ensure the content takes the full height
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Text Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#ff7043', fontWeight: 'bold' }}>
                Discover & Share Your Favorite Recipes
              </Typography>
              <Typography variant="h5" paragraph sx={{ fontStyle: 'italic', color: '#333' }}>
                Welcome to a community of passionate cooks and foodies! Whether you're a seasoned chef or a beginner, this is your place to explore, create, and share mouthwatering recipes.
              </Typography>

              <Typography variant="h6" paragraph sx={{ color: '#ff7043', fontWeight: 'bold' }}>
                What's Cooking?
              </Typography>
              <Typography variant="body1" paragraph>
                🍽 **Explore**: Browse hundreds of unique recipes from around the world, ranging from quick bites to gourmet masterpieces. <br />
                📝 **Share**: Post your own creations, showcase your culinary skills, and inspire others in the kitchen. <br />
                🔍 **Discover**: Find inspiration from other users and try something new every day!
              </Typography>

              <Button variant="contained" color="primary" component={Link} to="/recipes" sx={{ marginTop: '20px' }}>
                Explore the Recipes
              </Button>
            </Grid>

            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://img.freepik.com/premium-photo/handdrawn-background-chef-with-kitchen-utensils_1057389-39944.jpg?w=360"
                alt="Chef Illustration"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
              {/* "Made by" Text */}
              <Typography variant="body2" sx={{ marginTop: '10px', textAlign: 'center', color: '#ff7043', fontStyle: 'italic' }}>
                Made by Yuvraj Jindal & Kartik
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
