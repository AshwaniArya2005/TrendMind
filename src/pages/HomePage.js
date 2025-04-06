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
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: '#18445c'
                }}
              >
                TrendMind
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 3,
                  color: '#546e7a',
                  fontSize: '1.1rem'
                }}
              >
                Compare, Explore, and Review Latest AI Models.
              </Typography>
              
              <Typography 
                paragraph 
                sx={{ 
                  mb: 4,
                  color: '#546e7a',
                  lineHeight: 1.7
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
                  fontSize: '1rem'
                }}
              >
                Explore Models
              </Button>
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
              p: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4
            }}
          >
            <Box 
              sx={{ 
                width: { xs: '100%', md: '40%' },
                height: 300,
                bgcolor: '#f5f7f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src="/assets/featured-model.png"
                alt={recommendedModel.name}
                sx={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: '60%' } }}>
              <Typography variant="h5" component="h3" gutterBottom>
                {recommendedModel.name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {recommendedModel.description}
              </Typography>
              
              {recommendedModel.features.map((feature, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/model/${recommendedModel.id}`}
                >
                  View More
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
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
                    border: '1px solid #e0e9ef'
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="body1" 
                      component="p" 
                      gutterBottom
                      sx={{ 
                        fontStyle: 'italic',
                        fontWeight: 500,
                        mb: 2
                      }}
                    >
                      {review.text}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar 
                        src={review.avatar} 
                        alt={review.author}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {review.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
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