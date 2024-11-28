import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

function RecipeForm() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const recipe = response.data;
          setTitle(recipe.title);
          setIngredients(recipe.ingredients.join(', '));
          setInstructions(recipe.instructions);
        } catch (error) {
          console.error('Error fetching recipe', error);
          setError('Error fetching recipe');
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      if (id) {
        await axios.put(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes/${id}`, formData, config);
      } else {
        await axios.post(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes`, formData, config);
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe', error);
      setError(error.response?.data?.message || 'Error saving recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Recipe' : 'Add New Recipe'}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Ingredients (comma separated)"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <TextField
          label="Instructions"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
        <input
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (id ? 'Update Recipe' : 'Add Recipe')}
        </Button>
      </form>
    </Container>
  );
}

export default RecipeForm;

