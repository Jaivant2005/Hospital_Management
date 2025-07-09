import React, { useState } from 'react';
import userService from '../services/Userservice';
import '../App.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const user = { username, password };

    try {
      if (isLogin) {
        const response = await userService.validateUser(user);
        if (response.status === 200) {
          alert('Login successful!');
          window.location.href = '/dashboard';
        }
      } else {
        const response = await userService.createUser(user);
        if (response.status === 200) {
          setSuccessMessage('Registration successful. You can now login.');
          setIsLogin(true);
          setUsername('');
          setPassword('');
        }
      }
    } catch (error) {
      const errMsg =
        error.response?.data || (isLogin ? 'Login failed' : 'Registration failed');
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className='login-background'>
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
            {successMessage}
          </div>
        )}

        <div className="button-container">
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Return to Login'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
