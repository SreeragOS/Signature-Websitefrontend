import { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './login.css'; // same CSS as login.css, or just reuse login.css

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('signup/', formData);
      setSuccess('Signup successful! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      setSuccess('');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>
        <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
          <span>Already have an account? </span>
          <span
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
