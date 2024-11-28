import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Box, CircularProgress, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from './RecipeCard';

function RecipeList({ isAuthenticated }) {
  // State management for recipes, loading status, errors, and search term
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect hook to fetch recipes based on the search term
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes${searchTerm ? `?search=${searchTerm}` : ''}`);
        setRecipes(response.data); // Set the fetched recipes
        setLoading(false); // Set loading to false after the request is complete
      } catch (error) {
        console.error('Error fetching recipes', error);
        setError('Error fetching recipes. Please try again.'); // Handle errors
        setLoading(false); // Set loading to false on error
      }
    };
    fetchRecipes(); // Call the fetchRecipes function when the component mounts or searchTerm changes
  }, [searchTerm]); // Dependency array to re-run the effect if the searchTerm changes

  // Handle search term change to filter the recipes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update the search term state
  };

  // Display error message if an error occurred while fetching recipes
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#fff7e6', // Background color for the page
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipes
      </Typography>
      {/* Button to add new recipe only visible to authenticated users */}
      {isAuthenticated && (
        <Button component={Link} to="/recipes/new" variant="contained" sx={{ mb: 2, backgroundColor: '#004d47' }}>
          Add New Recipe
        </Button>
      )}
      {/* Search field for filtering recipes */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      {/* Display loading spinner while fetching data */}
      {loading ? (
        <CircularProgress />
      ) : (
        // Display grid of recipes after loading completes
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <RecipeCard recipe={recipe} searchTerm={searchTerm} />
            </Grid>
          ))}
        </Grid>
      )}
      {/* Display a message when no recipes are found */}
      {!loading && recipes.length === 0 && (
        <Typography variant="body1" sx={{ padding: '10px' }}>No recipes found. Try a different search term.</Typography>
      )}
    </Container>
    </Box>
  );
}

export default RecipeList;
