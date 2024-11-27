import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Box, CircularProgress, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from './RecipeCard';


function RecipeList({ isAuthenticated }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/recipes${searchTerm ? `?search=${searchTerm}` : ''}`);
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes', error);
        setError('Error fetching recipes. Please try again.');
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#fff7e6',
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipes
      </Typography>
      {isAuthenticated && (
        <Button component={Link} to="/recipes/new" variant="contained" color="primary" sx={{ mb: 2 }}>
          Add New Recipe
        </Button>
      )}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <RecipeCard recipe={recipe} searchTerm={searchTerm} />
            </Grid>
          ))}
        </Grid>
      )}
      {!loading && recipes.length === 0 && (
        <Typography variant="body1">No recipes found. Try a different search term.</Typography>
      )}
    </Container>
    </Box>
  );
}

export default RecipeList;

