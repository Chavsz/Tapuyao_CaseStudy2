import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin_Login_Signup.css';

const API_URL = 'http://localhost:5001/login';

function AdminLogin() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(API_URL, { username, password }); 
      localStorage.setItem('token', response.data.token);

      setUsername('');
      setPassword('');
      
      navigate('/'); // Navigate to the dashboard after successful login
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className='login-container-1'>
      <div className='elena'> 
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className='input'>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} // Updated to username
              required
            />
          </div>
          <div className='input'>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className='btn'>Enter</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
