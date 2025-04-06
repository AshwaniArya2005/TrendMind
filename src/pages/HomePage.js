import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import PreferencePrompt from '../components/PreferencePrompt';

// Mock data
const trendingModels = [
  {
    id: 1,
    name: 'AI Model 1',
    description: 'Body text for whatever you\'d like to add more to the subheading.',
    tags: ['NLP', 'Text Generation', 'GPT'],
    imageUrl: '/assets/model1.png',
    compareEnabled: true,
  },
  {
    id: 2,
    name: 'AI Model 2',
    description: 'Body text for whatever you\'d like to expand on the main point.',
    tags: ['Computer Vision', 'Image Recognition', 'Neural Network'],
    imageUrl: '/assets/model2.png',
    compareEnabled: true,
  },
  {
    id: 3,
    name: 'AI Model 3',
    description: 'Body text for whatever you\'d like to expand on the main point.',
    tags: ['Speech Recognition', 'Audio Processing', 'Deep Learning'],
    imageUrl: '/assets/model3.png',
    compareEnabled: true,
  },
];

const recommendedModel = {
  id: 4,
  name: 'AI Model Name',
  description: 'Body text for whatever you\'d like to expand on the main point.',
  features: [
    {
      title: 'Performance',
      description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes.'
    },
    {
      title: 'Accuracy',
      description: 'Body text for whatever you\'d like to add more to the main point. It provides details, explanations, and context.'
    }
  ],
  imageUrl: '/assets/featured-model.png',
  compareEnabled: true,
};

const userReviews = [
  {
    id: 1,
    text: '"A one-stop AI discovery hub!"',
    author: 'Sara P.',
    role: 'ML Engineer',
    avatar: '/assets/avatar1.png'
  },
  {
    id: 2,
    text: '"Super useful, just needs more filters"',
    author: 'Jared L.',
    role: 'Tech Researcher',
    avatar: '/assets/avatar2.png'
  },
  {
    id: 3,
    text: '"Perfect for AI enthusiasts!"',
    author: 'Nora D.',
    role: 'Data Scientist',
    avatar: '/assets/avatar3.png'
  }
];

const HomePage = () => {
  return (
    <>
      <Header />
      
      <Box 
        sx={{
          backgroundColor: '#e8f4fd',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    color: '#18445c',
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    mb: 2
                  }}
                >
                  TrendMind
                </Typography>

                {/* Preference prompt for logged-in users */}
                <PreferencePrompt />
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 3,
                    color: '#18445c',
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}
                >
                  Compare, Explore, and Review Latest AI Models.
                </Typography>
                
                <Typography 
                  paragraph 
                  sx={{ 
                    mb: 4,
                    color: '#546e7a',
                    lineHeight: 1.7,
                    fontSize: '0.95rem'
                  }}
                >
                  An intelligent discovery and summarization tool that keeps you effortlessly updated with the latest trends, breakthroughs, and insights in AI and technology. It scouts across multiple sources, identifies emerging topics, and generates digestible summaries tailored to your interests. Whether you're a researcher, developer, or AI enthusiast, TrendMind saves you hours of scrolling and brings the most relevant knowledge straight to you.
                </Typography>
                
                <Button 
                  variant="contained" 
                  size="large" 
                  color="primary" 
                  component={RouterLink} 
                  to="/discover"
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    textTransform: 'none',
                    backgroundColor: '#18445c',
                    borderRadius: 1,
                    alignSelf: 'flex-start',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: '#0d3242',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Explore Models
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/hero-image.png"
                alt="AI technology illustration"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        {/* Trending Models Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            Trending Model
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {trendingModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <ModelCard model={model} />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Recommended Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            Recommended
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 0 },
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                width: { xs: '100%', md: '45%' },
                height: { xs: 250, md: 'auto' },
                bgcolor: '#f0f4f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <Box
                component="img"
                src="/assets/featured-model.png"
                alt={recommendedModel.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Overlay border lines in corners */}
              <Box sx={{ 
                position: 'absolute', 
                top: 15, 
                left: 15, 
                width: 25, 
                height: 25, 
                borderTop: '2px solid #db7093', 
                borderLeft: '2px solid #db7093' 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: 15, 
                right: 15, 
                width: 25, 
                height: 25, 
                borderTop: '2px solid #db7093', 
                borderRight: '2px solid #db7093' 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 15, 
                left: 15, 
                width: 25, 
                height: 25, 
                borderBottom: '2px solid #db7093', 
                borderLeft: '2px solid #db7093' 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 15, 
                right: 15, 
                width: 25, 
                height: 25, 
                borderBottom: '2px solid #db7093', 
                borderRight: '2px solid #db7093' 
              }} />
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', md: '55%' },
              p: { xs: 2, md: 4 },
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                  fontSize: '1.25rem'
                }}
              >
                {recommendedModel.name}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: '#546e7a',
                  fontSize: '0.95rem',
                  lineHeight: 1.5
                }}
              >
                {recommendedModel.description}
              </Typography>
              
              {recommendedModel.features.map((feature, index) => (
                <Box key={index} sx={{ mb: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#18445c'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#546e7a',
                      lineHeight: 1.5,
                      fontSize: '0.9rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/model/${recommendedModel.id}`}
                  sx={{
                    backgroundColor: '#18445c',
                    textTransform: 'none',
                    borderRadius: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#0d3242',
                    }
                  }}
                >
                  View More
                </Button>
                
                <Button 
                  variant="outlined" 
                  sx={{
                    color: '#18445c',
                    borderColor: '#c9d6df',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    borderRadius: 1,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#18445c',
                      backgroundColor: '#f5f8fa',
                    }
                  }}
                >
                  Compare
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* User Reviews Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 4,
              fontWeight: 600,
              color: '#18445c'
            }}
          >
            User Reviews
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {userReviews.map((review) => (
              <Grid item xs={12} sm={6} md={4} key={review.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: '#f8fbfd',
                    border: '1px solid #e0e9ef',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="body1" 
                      component="p" 
                      gutterBottom
                      sx={{ 
                        fontStyle: 'italic',
                        fontWeight: 500,
                        mb: 3,
                        fontSize: '1rem',
                        color: '#18445c',
                        lineHeight: 1.5
                      }}
                    >
                      {review.text}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <Avatar 
                        src={review.avatar} 
                        alt={review.author}
                        sx={{ 
                          mr: 2,
                          width: 48,
                          height: 48,
                          border: '2px solid #e0e9ef'
                        }}
                      />
                      <Box>
                        <Typography 
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: '#333'
                          }}
                        >
                          {review.author}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: '#6e96af',
                            fontWeight: 500
                          }}
                        >
                          {review.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default HomePage; 