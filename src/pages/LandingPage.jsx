import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import docs from '../data';

const frameworks = Object.keys(docs);

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
        Welcome to SDK Integration Docs
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {frameworks.map(framework => (
          <Grid item xs={12} sm={6} md={3} key={framework}>
            <Card>
              <CardActionArea onClick={() => navigate(`/${framework}`)}>
                <CardContent>
                  <Typography variant="h5" align="center">
                    {framework.charAt(0).toUpperCase() + framework.slice(1)}
                  </Typography>
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