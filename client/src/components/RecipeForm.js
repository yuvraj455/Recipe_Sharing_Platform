import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

function RecipeForm() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('No file chosen');
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
          setYoutubeLink(recipe.youtubeLink || '');
          if (recipe.image) {
            setImageName(recipe.image.split('/').pop() || 'Current image');
          }
        } catch (error) {
          console.error('Error fetching recipe', error);
          setError('Error fetching recipe');
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('youtubeLink', youtubeLink);
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
        await axios.post('https://recipe-sharing-platform-av3r.onrender.com/api/recipes', formData, config);
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9zci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3B4MTM2OTgxMy1pbWFnZS1rd3Z4eHA5MS5qcGc.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 0,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#FFFFF0',
          padding: '10px',
          borderRadius: '20px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        }}
      >
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
          <TextField
            label="YouTube Link"
            fullWidth
            margin="normal"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="upload-image"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-image">
              <Button
                variant="outlined"
                component="span"
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  backgroundColor: '#F5F5F5',
                  '&:hover': {
                    backgroundColor: '#E0E0E0',
                  },
                }}
              >
                Choose Dish Image
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
              {imageName}
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#004d47', borderRadius: '10px' }}
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

