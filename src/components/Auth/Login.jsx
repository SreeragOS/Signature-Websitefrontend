import { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('All fields are required.');
      return;
    }
    try {
      const res = await api.post('login/', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('is_superuser', res.data.is_superuser);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <p className="subtitle">Enter your credentials to log in</p>
        {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
        <button type="submit" className="signup-btn">Log In</button>
        <div className="login-link">
          Don't have an account?{' '}
          <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }} onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
