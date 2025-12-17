import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import docs from '../data';

const navLinks = [
  { label: 'Home', path: '/' },
  ...Object.keys(docs).map(framework => ({
    label: framework.charAt(0).toUpperCase() + framework.slice(1),
    path: `/${framework}`,
  })),
];

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>Netcore SDK Integration Docs</Typography>
        {navLinks.map(link => (
          <Button
            key={link.path}
            color={location.pathname === link.path ? 'secondary' : 'inherit'}
            onClick={() => navigate(link.path)}
            sx={{ ml: 1 }}
          >
            {link.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
export default NavBar; 