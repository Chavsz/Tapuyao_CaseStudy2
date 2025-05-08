import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin_Login_Signup.css';
import  * as riIcons from "react-icons/ri";
import * as io5Icons from "react-icons/io5";

const API_URL = 'http://localhost:5001/login';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, { username, password });
      localStorage.setItem('token', response.data.token);

      setUsername('');
      setPassword('');
      
      navigate('/'); // Navigate to the dashboard after successful login
    } catch (err) {
      setError('Invalid credentials, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container-1'>
        <div className='logo-wrapper'>
          <div className='elena'></div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <h2>Admin Login</h2>
            <p className="welcome-text">Welcome back! Please enter your credentials</p>
          </div>
          
          {error && <div className="error-message"><i className="error-icon">!</i>{error}</div>}
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className='form-group'>
              <label htmlFor="username">Username</label>
              <div className='input-wrapper'>
                <div className="input-icon">
                  <riIcons.RiUser3Fill />
                </div>
                <input 
                  id="username"
                  type="text" 
                  placeholder="Enter your username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className='form-group'>
              <label htmlFor="password">Password</label>
              <div className='input-wrapper'>
                <div className="input-icon">
                  <riIcons.RiLockPasswordFill />
                </div>
                <input 
                  id="password"
                  type="password"   
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`btn login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;