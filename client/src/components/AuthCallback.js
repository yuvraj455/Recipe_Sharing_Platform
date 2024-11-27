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
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      navigate('/recipes');
    } else {
      navigate('/login');
    }
  }, [location, navigate, setIsAuthenticated]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
