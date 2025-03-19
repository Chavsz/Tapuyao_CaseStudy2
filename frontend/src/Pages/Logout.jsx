import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/admin-login'); // Redirect to the login page
  }, [navigate]);

  return null;
}

export default Logout;
