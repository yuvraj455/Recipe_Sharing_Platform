import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import AuthCallback from './components/AuthCallback';

// Create a custom theme using Material-UI's createTheme function
const theme = createTheme();

function App() {
  // State variables to manage authentication and search term
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if the user is authenticated on initial load by checking localStorage
  useEffect(() => {
    // Get token and userId from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    // If both token and userId exist, set isAuthenticated to true
    setIsAuthenticated(!!(token && userId)); // !! ensures the value is a boolean (true/false)
  }, []);

  // PrivateRoute component: used to restrict access to certain routes if the user is not authenticated
  const PrivateRoute = ({ children }) => {
    // If the user is authenticated, render the children (private content); otherwise, redirect to login
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    // ThemeProvider applies the custom theme globally
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS and applies default styles for a consistent appearance */}
      
      {/* Router wraps the app and enables routing */}
      <Router>
        {/* Navbar component, passing necessary props like authentication status and search term */}
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Define the app routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> {/* Login page */}
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} /> {/* Registration page */}

          {/* Recipe list page with search functionality */}
          <Route 
            path="/recipes" 
            element={<RecipeList isAuthenticated={isAuthenticated} searchTerm={searchTerm} />} 
          />

          {/* Recipe detail page */}
          <Route 
            path="/recipes/:id" 
            element={<RecipeDetail isAuthenticated={isAuthenticated} />} 
          />

          {/* Private routes, only accessible when the user is authenticated */}
          <Route 
            path="/recipes/new" 
            element={
              <PrivateRoute>
                <RecipeForm /> {/* Form to create a new recipe */}
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recipes/:id/edit" 
            element={
              <PrivateRoute>
                <RecipeForm /> {/* Form to edit an existing recipe */}
              </PrivateRoute>
            } 
          />

          {/* Callback route for authentication (e.g., after OAuth login) */}
          <Route 
            path="/auth-callback" 
            element={<AuthCallback setIsAuthenticated={setIsAuthenticated} />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
