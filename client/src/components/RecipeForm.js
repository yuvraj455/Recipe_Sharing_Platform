import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
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
          const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
          const recipe = response.data;
          setTitle(recipe.title);
          setIngredients(recipe.ingredients.join(', '));
          setInstructions(recipe.instructions);
        } catch (error) {
          console.error('Error fetching recipe', error);
          setError('Error fetching recipe: ' + (error.response?.data?.message || error.message));
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
        await axios.put(`http://localhost:5000/api/recipes/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/recipes', formData, config);
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe', error);
      setError('Error saving recipe: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#fff7e6',
        padding: 0, // Remove padding on outer Box to make it stretch fully
      }}
    >
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
          fullWidth 
          sx={{ mt: 2, backgroundColor: '#004d47' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : (id ? 'Update Recipe' : 'Add Recipe')}
        </Button>
      </form>
    </Container>
    </Box>
  );
}

export default RecipeForm;

