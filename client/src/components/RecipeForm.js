import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

function RecipeForm() {
  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [image, setImage] = useState(null); // Stores the uploaded image file
  const [imageName, setImageName] = useState('No file chosen'); // Displays the chosen file name
  const [error, setError] = useState(''); // Stores error messages
  const [loading, setLoading] = useState(false); // Tracks the loading state for form submission

  // React Router hooks for navigation and accessing route parameters
  const navigate = useNavigate();
  const { id } = useParams(); // `id` indicates whether the form is for editing or adding a recipe

  const API_URL = 'https://recipe-sharing-platform-av3r.onrender.com'; // Base API URL

  // Fetch recipe details if an `id` is provided (Edit Mode)
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token'); // Get token from localStorage for authentication
          const response = await axios.get(`${API_URL}/api/recipes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }, // Attach token in request headers
          });
          const recipe = response.data; // Extract recipe data
          setTitle(recipe.title);
          setIngredients(recipe.ingredients.join(', ')); // Convert ingredients array to comma-separated string
          setInstructions(recipe.instructions);
          setYoutubeLink(recipe.youtubeLink || ''); // Set YouTube link if it exists
        } catch (error) {
          console.error('Error fetching recipe', error);
          setError('Error fetching recipe'); // Display error message
        }
      };
      fetchRecipe(); // Call the function to fetch recipe details
    }
  }, [id]);

  // Handler for file input change (selecting an image)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImage(file); // Update the image state
      setImageName(file.name); // Update the displayed file name
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true
    setError(''); // Clear any existing error messages

    // Create a FormData object to handle form submission with a file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('youtubeLink', youtubeLink);
    if (image) {
      formData.append('image', image); // Append the image file to the form data
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve the token for authentication
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Set header for file upload
          Authorization: `Bearer ${token}`, // Attach token for API authentication
        },
      };

      let response;
      if (id) {
        // Update existing recipe
        response = await axios.put(`${API_URL}/api/recipes/${id}`, formData, config);
      } else {
        // Add a new recipe
        response = await axios.post(`${API_URL}/api/recipes`, formData, config);
      }
      console.log('Recipe saved:', response.data); // Log success response
      navigate('/recipes'); // Redirect to the recipes list page
    } catch (error) {
      console.error('Error saving recipe', error);
      if (error.response && error.response.status === 401) {
        // Handle token expiration or invalid token
        localStorage.removeItem('token'); // Clear the token from localStorage
        navigate('/login'); // Redirect to login page
      } else {
        // Display a custom error message if available, else a generic one
        setError(error.response?.data?.message || 'Error saving recipe. Please try again.');
      }
    } finally {
      setLoading(false); // Reset loading state
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
            onChange={(e) => setTitle(e.target.value)} // Update title state on change
            required
          />
          <TextField
            label="Ingredients (comma separated)"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)} // Update ingredients state on change
            required
          />
          <TextField
            label="Instructions"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)} // Update instructions state on change
            required
          />
          <TextField
            label="YouTube Link"
            fullWidth
            margin="normal"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)} // Update YouTube link state on change
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              id="upload-image"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              required // Handle image file input change
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
              {imageName} {/* Display the chosen image file name */}
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
