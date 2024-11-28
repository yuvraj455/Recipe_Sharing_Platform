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

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/recipes" element={<RecipeList isAuthenticated={isAuthenticated} />} />
          <Route path="/recipes/:id" element={<RecipeDetail isAuthenticated={isAuthenticated} />} />
          <Route 
            path="/recipes/new" 
            element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recipes/:id/edit" 
            element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            } 
          />
          <Route path="/auth-callback" element={<AuthCallback setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

