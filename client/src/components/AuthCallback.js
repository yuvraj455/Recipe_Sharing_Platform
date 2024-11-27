import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    
    if (token && userId) {
      // Store token and userId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      
      // Set authentication state to true
      setIsAuthenticated(true);
      
      // Get the previous location (if any) or default to '/recipes'
      const previousLocation = location.state?.from || '/recipes';
      navigate(previousLocation);
    } else {
      // Redirect to login if token or userId is missing
      navigate('/login');
    }
  }, [location, navigate, setIsAuthenticated]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
