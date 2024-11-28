import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, searchTerm }) => {
  // If no recipe data is passed, return nothing
  if (!recipe) {
    return null;
  }

  // Function to highlight the search term within the recipe title
  const highlightSearchTerm = (text, term) => {
    // If no search term is provided, return the text as is
    if (!term) return text;
    
    // Split the text by the search term (case insensitive)
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    
    // Map through each part of the text and highlight the matching search term
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <mark key={index}>{part}</mark>  // Highlight the matching part
        : part  // Leave the non-matching parts as they are
    );
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* CardActionArea makes the card clickable and links to the recipe detail page */}
      <CardActionArea component={Link} to={`/recipes/${recipe._id}`}>
        {/* Display the recipe image, fallback to placeholder if not available */}
        <CardMedia
          component="img"
          height="140"
          image={recipe.image ? `https://recipe-sharing-platform-av3r.onrender.com${recipe.image}` : '/placeholder.svg?height=140&width=280'}
          alt={recipe.title || 'Recipe image'}  // Fallback alt text if title is missing
        />
        <CardContent>
          {/* Display recipe title with highlighted search term */}
          <Typography gutterBottom variant="h5" component="div">
            {highlightSearchTerm(recipe.title || 'Untitled Recipe', searchTerm)}
          </Typography>
          {/* Display the author’s name or 'Unknown' if not available */}
          <Typography variant="body2" color="text.secondary">
            {recipe.author ? (recipe.author.username || recipe.author.name || 'Unknown') : 'Unknown'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
