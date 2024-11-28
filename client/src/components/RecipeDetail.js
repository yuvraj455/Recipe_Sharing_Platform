import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button, Card, CardMedia, CircularProgress } from '@mui/material';
import axios from 'axios';

function RecipeDetail({ isAuthenticated }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe', error);
        setError('Error fetching recipe. Please try again.');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe', error);
      setError('Error deleting recipe. Please try again.');
    }
  };

  const isAuthor = (recipe, userId) => {
    return recipe && recipe.author && (recipe.author._id === userId || recipe.author === userId);
  };

  const debugInfo = useMemo(() => {
    const userId = localStorage.getItem('userId');
    return {
      recipeAuthorId: recipe?.author ? (recipe.author._id || recipe.author) : 'No author ID',
      localStorageUserId: userId,
      isAuthenticated: isAuthenticated,
      isAuthor: isAuthor(recipe, userId)
    };
  }, [recipe, isAuthenticated]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recipe) return <Typography>Recipe not found.</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {recipe.title}
      </Typography>
      <Card sx={{ maxWidth: 345, mb: 2 }}>
        <CardMedia
          component="img"
          height="194"
          image={recipe.image ? `${process.env.REACT_APP_API_URL}${recipe.image}` : '/placeholder.svg?height=194&width=345'}
          alt={recipe.title}
        />
      </Card>
      <Typography variant="subtitle1" gutterBottom>
        by {recipe.author ? (recipe.author.name || 'Unknown') : 'Unknown'}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Ingredients:
      </Typography>
      <List>
        {recipe.ingredients.map((ingredient, index) => (
          <ListItem key={index}>
            <ListItemText primary={ingredient} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        Instructions:
      </Typography>
      <Typography variant="body1" paragraph>
        {recipe.instructions}
      </Typography>
      {isAuthenticated && isAuthor(recipe, localStorage.getItem('userId')) && (
        <>
          <Button component={Link} to={`/recipes/${id}/edit`} variant="contained" color="primary" sx={{ mr: 2 }}>
            Edit Recipe
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Recipe
          </Button>
        </>
      )}
    </Container>
  );
}

export default RecipeDetail;

