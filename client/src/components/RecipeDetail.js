import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Box, ListItemText, Button, Card, CardMedia, CircularProgress } from '@mui/material';
import axios from 'axios';

const isAuthor = (recipe, userId) => {
  if (!recipe || !userId) return false;
  const authorId = recipe.author ? (recipe.author._id || recipe.author.id) : null;
  return authorId === userId;
};

function RecipeDetail({ isAuthenticated }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe', error);
      setError('Error fetching recipe. Please try again.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleDelete = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe', error);
      setError('Error deleting recipe. Please try again.');
    }
  }, [id, navigate]);

  const debugInfo = useMemo(() => {
    const userId = localStorage.getItem('userId');
    return {
      recipeAuthorId: recipe?.author ? recipe.author._id || recipe.author.id : 'No author ID',
      localStorageUserId: userId,
      isAuthenticated: isAuthenticated,
      isAuthor: isAuthor(recipe, userId)
    };
  }, [recipe, isAuthenticated]);

  if (loading) return <CircularProgress sx={{ color: '#4caf50' }} />;
  if (error) return <Typography color="error" sx={{ fontWeight: 'bold' }}>{error}</Typography>;
  if (!recipe) return <Typography sx={{ fontSize: '1.2rem', fontStyle: 'italic' }}>Recipe not found.</Typography>;

  const ingredientsList = recipe.ingredients;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: 0,
        marginTop: '20px',
      }}
    >
      <Container
        sx={{
          backgroundColor: '#ffffff',
          padding: 4,
          borderRadius: 4,
          boxShadow: 4,
          width: '100%',
          maxWidth: 900,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#333' }}>
          {recipe.title}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Card sx={{ maxWidth: 345, borderRadius: '8px' }}>
            <CardMedia
              component="img"
              height="194"
              image={recipe.image ? `http://localhost:5000${recipe.image}` : '/placeholder.svg?height=194&width=345'}
              alt={recipe.title}
              sx={{
                borderRadius: '8px',
                '&:hover': {
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.7)',
                },
              }}
            />
          </Card>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', color: '#777' }}>
          by {recipe.author ? (recipe.author.username || recipe.author.name || 'Unknown') : 'Unknown'}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: '#4caf50' }}>
          Ingredients:
        </Typography>
        <List sx={{ paddingLeft: 2 }}>
          {ingredientsList.slice(0, showAllIngredients ? ingredientsList.length : 5).map((ingredient, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 1 }}>
              <ListItemText primary={ingredient.trim()} sx={{ color: '#555' }} />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => setShowAllIngredients((prev) => !prev)}
          sx={{
            display: 'block',
            margin: '20px auto',
            backgroundColor: '#4caf50',
            color: '#fff',
            '&:hover': { backgroundColor: '#388e3c' },
          }}
        >
          {showAllIngredients ? 'Show Less Ingredients' : 'Show More Ingredients'}
        </Button>

        <Typography variant="h6" gutterBottom sx={{ color: '#4caf50', marginTop: 3 }}>
          Instructions:
        </Typography>
        <Box
          sx={{
            backgroundColor: '#f4f4f4',
            padding: 2,
            borderRadius: 2,
            color: '#333',
            whiteSpace: 'pre-line',
            fontSize: '1rem',
          }}
        >
          {recipe.instructions}
        </Box>

        {isAuthenticated && debugInfo.isAuthor && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            <Button
              component={Link}
              to={`/recipes/${id}/edit`}
              variant="contained"
              color="primary"
              sx={{
                '&:hover': { backgroundColor: '#1976d2' },
                padding: '10px 20px',
              }}
            >
              Edit Recipe
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              sx={{
                '&:hover': { backgroundColor: '#d32f2f' },
                padding: '10px 20px',
              }}
            >
              Delete Recipe
            </Button>
          </Box>
        )}

        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Debug Info:</Typography>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default RecipeDetail;

