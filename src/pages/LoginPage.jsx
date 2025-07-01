import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '80px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Admin Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
} 