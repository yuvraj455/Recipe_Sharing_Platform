import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

// RecipeCard component renders a card displaying a recipe's details.
// Props:
// - recipe: The recipe object containing details like title, image, author, and id.
// - searchTerm: The term to highlight within the recipe's title if it matches.
const RecipeCard = ({ recipe, searchTerm }) => {
  // If the recipe object is not provided or is null, the component returns null (renders nothing).
  if (!recipe) {
    return null;
  }

  // Helper function to highlight the search term within a text.
  // It splits the text around the matching term and wraps the term with a <mark> tag.
  const highlightSearchTerm = (text, term) => {
    if (!term) return text; // If no search term is provided, return the original text.
    const parts = text.split(new RegExp(`(${term})`, 'gi')); // Split text by the search term (case-insensitive).
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    // The card component is styled with a maximum width of 345px and is interactive via the CardActionArea.
    <Card sx={{ maxWidth: 345 }}>
      {/* CardActionArea wraps the card content and links to the specific recipe's detail page using its ID */}
      <CardActionArea component={Link} to={`/recipes/${recipe._id}`}>
        {/* Displays the recipe's image or a placeholder image if none is provided */}
        <CardMedia
          component="img"
          height="140"
          image={recipe.image || '/placeholder.svg?height=140&width=280'}
          alt={recipe.title || 'Recipe image'}
        />
        <CardContent>
          {/* Recipe title is displayed with the search term highlighted if applicable */}
          <Typography gutterBottom variant="h5" component="div">
            {highlightSearchTerm(recipe.title || 'Untitled Recipe', searchTerm)}
          </Typography>
          {/* Displays the author's name or username if available, otherwise shows 'Unknown' */}
          <Typography variant="body2" color="text.secondary">
            {recipe.author ? (recipe.author.username || recipe.author.name || 'Unknown') : 'Unknown'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
