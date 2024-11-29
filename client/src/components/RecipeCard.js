import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, searchTerm }) => {
  if (!recipe) {
    return null;
  }

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea component={Link} to={`/recipes/${recipe._id}`}>
        <CardMedia
          component="img"
          height="140"
          image={recipe.image || '/placeholder.svg?height=140&width=280'}
          alt={recipe.title || 'Recipe image'}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {highlightSearchTerm(recipe.title || 'Untitled Recipe', searchTerm)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description || 'No description available'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;

