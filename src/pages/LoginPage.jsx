import React, { useState } from 'react';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setError('');
      if (onLogin) onLogin();
      window.location.href = '/admin'; // redirect to admin after login
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '80px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Admin Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
} 