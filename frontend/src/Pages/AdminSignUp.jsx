import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Admin_Login_Signup.css'

const API_URL = 'http://localhost:5001/admin/signup';

function AdminSignup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post(API_URL, { username, password });
      navigate('/admin-login'); // Redirect to login page after signup
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    
    <div className='login-container-2'>
      <div className="login-container">
        <form className="signup-form" onSubmit={handleSignup}>
          <h2>Admin Signup</h2>
          {error && <p className="error-message">{error}</p>}

          <div className='input'>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
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
          <div className='input'>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='btn'>Sign Up</button>
          <p className='reg'>
            <Link to='/admin-login'>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
