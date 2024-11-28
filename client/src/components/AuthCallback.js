import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AuthCallback Component
 * Handles the authentication callback logic after a user logs in through an external provider (e.g., Google OAuth).
 * Extracts query parameters from the URL, saves user credentials in localStorage, 
 * updates authentication state, and redirects the user accordingly.
 */
function AuthCallback({ setIsAuthenticated }) {
  const navigate = useNavigate(); // Used for programmatically navigating to different routes.
  const location = useLocation(); // Provides access to the current location (URL) object.

  useEffect(() => {
    // Extract query parameters from the URL (token and userId).
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); // Authentication token from the server.
    const userId = params.get('userId'); // Unique identifier for the authenticated user.

    // Check if both token and userId exist in the URL parameters.
    if (token && userId) {
      // Store the token and userId in the browser's localStorage for persistent session management.
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Update the parent component's authentication state to reflect that the user is logged in.
      setIsAuthenticated(true);

      // Redirect the user to the main recipes page after successful authentication.
      navigate('/recipes');
    } else {
      // Redirect the user to the login page if authentication fails or is incomplete.
      navigate('/login');
    }
  }, [location, navigate, setIsAuthenticated]); // Dependencies ensure this effect runs when these values change.

  // Display a simple message while the authentication logic is being processed.
  return <div>Authenticating...</div>;
}

export default AuthCallback;
