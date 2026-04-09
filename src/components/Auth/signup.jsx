import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './login.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await api.post('signup/', {
        username: form.username,
        password: form.password,
      });
      setSuccess('Signup successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <p className="subtitle">Enter your details below to create your account</p>
        {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p className="success" style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="John Doe"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label className="password-label">
          Password
          <div className="password-input-wrapper">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <label className="password-label">
          Confirm Password
          <div className="password-input-wrapper">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </label>
        <button type="submit" className="signup-btn">Sign up</button>
        <div className="login-link">
          Already have an account? <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }} onClick={() => navigate('/login')}>Log in</span>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
