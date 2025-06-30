import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const frameworks = [
  { label: 'Android', path: '/android' },
  { label: 'iOS', path: '/ios' },
  { label: 'Flutter', path: '/flutter' },
  { label: 'React Native', path: '/reactnative' }
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
        Welcome to SDK Integration Docs
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {frameworks.map(fw => (
          <Grid item xs={12} sm={6} md={3} key={fw.label}>
            <Card>
              <CardActionArea onClick={() => navigate(fw.path)}>
                <CardContent>
                  <Typography variant="h5" align="center">{fw.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default LandingPage; 