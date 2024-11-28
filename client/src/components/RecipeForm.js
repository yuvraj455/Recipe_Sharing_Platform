import React, { useState, useEffect } from 'react'; // Importing necessary hooks and components from React
import { useNavigate, useParams } from 'react-router-dom'; // Importing hooks for navigation and route parameters
import { Container, TextField, Box, Button, Typography, Alert, CircularProgress } from '@mui/material'; // Material UI components
import axios from 'axios'; // Axios for API calls

function RecipeForm() {
  // State hooks for managing form data and UI states
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('No file chosen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Used for navigation after form submission
  const { id } = useParams(); // Extracts the recipe ID from the URL for editing an existing recipe

  // Fetch recipe data if 'id' is present (for editing an existing recipe)
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token'); // Getting JWT token from localStorage for authentication
          const response = await axios.get(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const recipe = response.data;
          // Pre-filling form fields with fetched recipe data
          setTitle(recipe.title);
          setIngredients(recipe.ingredients.join(', '));
          setInstructions(recipe.instructions);
          setYoutubeLink(recipe.youtubeLink || '');
        } catch (error) {
          console.error('Error fetching recipe', error);
          setError('Error fetching recipe'); // Error handling
        }
      };
      fetchRecipe();
    }
  }, [id]); // The effect depends on the `id` parameter to fetch the correct recipe

  // Handler for file input change (selecting an image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Updating the image state
      setImageName(file.name); // Displaying the selected file name
    }
  };

  // Handler for form submission (creating or updating a recipe)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing the default form submission behavior
    setLoading(true); // Setting loading state to true while submitting
    setError(''); // Resetting any previous errors

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('youtubeLink', youtubeLink);
    if (image) {
      formData.append('image', image); // Adding the image if present
    }

    try {
      const token = localStorage.getItem('token'); // Getting JWT token for authentication
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data', // Specifying form data content type
          Authorization: `Bearer ${token}` // Adding the token in the request header for authentication
        }
      };

      // If there's an ID, we update the existing recipe, else we create a new recipe
      if (id) {
        await axios.put(`https://recipe-sharing-platform-av3r.onrender.com/api/recipes/${id}`, formData, config);
      } else {
        await axios.post('https://recipe-sharing-platform-av3r.onrender.com/api/recipes', formData, config);
      }

      navigate('/recipes'); // Navigating to the recipes page after successful form submission
    } catch (error) {
      console.error('Error saving recipe', error);
      setError(error.response?.data?.message || 'Error saving recipe. Please try again.'); // Handling errors
    } finally {
      setLoading(false); // Resetting loading state after request completion
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
        backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3B4MTM2OTgxMy1pbWFnZS1rd3Z4eHA5MS5qcGc.jpg')`, // Custom background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 0,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#FFFFF0', // Light background for the form
          padding: '10px',
          borderRadius: '20px', // Rounded corners for the form container
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Subtle shadow for the form container
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
            onChange={(e) => setTitle(e.target.value)} // Updating title field on change
            required
          />
          <TextField
            label="Ingredients (comma separated)"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)} // Updating ingredients field
            required
          />
          <TextField
            label="Instructions"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)} // Updating instructions field
            required
          />
          <TextField
            label="YouTube Link"
            fullWidth
            margin="normal"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)} // Updating YouTube link field
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="upload-image"
              style={{ display: 'none' }}
              onChange={handleFileChange} // Handling image file input change
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
            disabled={loading} // Disabling button during form submission
          >
            {loading ? <CircularProgress size={24} /> : (id ? 'Update Recipe' : 'Add Recipe')}
          </Button>
        </form>
      </Container>
    </Box>
  );
}

export default RecipeForm;
