import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AI Model Blog Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover the latest AI models through AI-generated blogs
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="/" color="inherit">
                Home
              </Link>
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="/login" color="inherit">
                Login
              </Link>
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="/register" color="inherit">
                Register
              </Link>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="#" color="inherit">
                Terms of Service
              </Link>
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="#" color="inherit">
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Link href="#" color="inherit">
                Contact Us
              </Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="/">
            AI Model Blog Generator
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 