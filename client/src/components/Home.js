import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button } from '@mui/material';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Arrange content vertically
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        minHeight: '90.7vh', // Cover nearly full viewport height
        backgroundColor: '#fff7e6', // Light beige background color
        padding: 0, // Remove padding to make the box stretch fully
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            padding: '30px', // Internal padding for spacing
            borderRadius: '15px', // Rounded corners for aesthetic
            boxShadow: '10px 6px 12px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for elevation
            display: 'flex', // Flex layout for internal content
            flexDirection: 'row', // Align children horizontally
            justifyContent: 'space-between', // Spread children evenly
            backgroundColor: '#fff7e6', // Match the background color
            alignItems: 'center', // Align items vertically in the center
            height: '100%', // Ensure full height utilization
          }}
        >
          {/* Grid layout for text and image sections */}
          <Grid container spacing={4} alignItems="center">
            {/* Text Section */}
            <Grid item xs={12} md={6}>
              {/* Header Title */}
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ color: '#ff7043', fontWeight: 'bold' }} // Orange bold text
              >
                Discover & Share Your Favorite Recipes
              </Typography>
              
              {/* Subtitle */}
              <Typography
                variant="h5"
                paragraph
                sx={{ fontStyle: 'italic', color: '#333' }} // Italic gray text
              >
                Welcome to a community of passionate cooks and foodies! Whether you're a seasoned chef or a beginner, this is your place to explore, create, and share mouthwatering recipes.
              </Typography>

              {/* Feature Highlights */}
              <Typography
                variant="h6"
                paragraph
                sx={{ color: '#ff7043', fontWeight: 'bold' }} // Orange bold sub-header
              >
                What's Cooking?
              </Typography>
              <Typography variant="body1" paragraph>
                🍽 **Explore**: Browse hundreds of unique recipes from around the world, ranging from quick bites to gourmet masterpieces. <br />
                📝 **Share**: Post your own creations, showcase your culinary skills, and inspire others in the kitchen. <br />
                🔍 **Discover**: Find inspiration from other users and try something new every day!
              </Typography>

              {/* Call-to-Action Button */}
              <Button
                variant="contained"
                component={Link}
                to="/recipes"
                sx={{ marginTop: '20px', backgroundColor: '#004d47' }} // Green background for button
              >
                Explore the Recipes
              </Button>
            </Grid>

            {/* Image Section */}
            <Grid item xs={12} md={6}>
              {/* Illustration */}
              <Box
                component="img"
                src="https://img.freepik.com/premium-photo/handdrawn-background-chef-with-kitchen-utensils_1057389-39944.jpg?w=360"
                alt="Chef Illustration"
                sx={{
                  width: '100%', // Full width
                  maxWidth: '400px', // Restrict maximum width
                  margin: '0 auto', // Center align horizontally
                  display: 'block', // Ensure image is treated as a block element
                }}
              />
              {/* Attribution Text */}
              <Typography
                variant="body2"
                sx={{
                  marginTop: '10px',
                  textAlign: 'center', // Center-align text
                  color: '#ff7043', // Orange text color
                  fontStyle: 'italic', // Italic font style
                }}
              >
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
