import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';

// Mock data for models
const mockModels = [
  {
    id: 1,
    name: 'AI Model 1',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['NLP', 'Text Generation', 'Transformer'],
    imageUrl: '/assets/model1.png',
    compareEnabled: true,
  },
  {
    id: 2,
    name: 'AI Model 2',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Computer Vision', 'Image Recognition', 'CNN'],
    imageUrl: '/assets/model2.png',
    compareEnabled: true,
  },
  {
    id: 3,
    name: 'AI Model 3',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Speech Recognition', 'Audio Processing', 'RNN'],
    imageUrl: '/assets/model3.png',
    compareEnabled: true,
  },
  {
    id: 4,
    name: 'AI Model 4',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Generative AI', 'Image Generation', 'GAN'],
    imageUrl: '/assets/model4.png',
    compareEnabled: true,
  },
  {
    id: 5,
    name: 'AI Model 5',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Recommendation', 'Personalization', 'Neural Network'],
    imageUrl: '/assets/model5.png',
    compareEnabled: true,
  },
  {
    id: 6,
    name: 'AI Model 6',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Reinforcement Learning', 'Game AI', 'Decision Making'],
    imageUrl: '/assets/model6.png',
    compareEnabled: true,
  },
  {
    id: 7,
    name: 'AI Model 7',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['NLP', 'Question Answering', 'BERT'],
    imageUrl: '/assets/model7.png',
    compareEnabled: true,
  },
  {
    id: 8,
    name: 'AI Model 8',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Computer Vision', 'Object Detection', 'YOLO'],
    imageUrl: '/assets/model8.png',
    compareEnabled: true,
  },
  {
    id: 9,
    name: 'AI Model 9',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['MultiModal', 'Text-to-Image', 'Diffusion Models'],
    imageUrl: '/assets/model9.png',
    compareEnabled: true,
  },
  {
    id: 10,
    name: 'AI Model 10',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Edge AI', 'Embedded Systems', 'Optimization'],
    imageUrl: '/assets/model10.png',
    compareEnabled: true,
  },
  {
    id: 11,
    name: 'AI Model 11',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['LLM', 'Chatbot', 'Generative AI'],
    imageUrl: '/assets/model11.png',
    compareEnabled: true,
  },
  {
    id: 12,
    name: 'AI Model 12',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or a very short chart.',
    tags: ['Time Series', 'Forecasting', 'LSTM'],
    imageUrl: '/assets/model12.png',
    compareEnabled: true,
  }
];

const DiscoverPage = () => {
  // State for filters
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#18445c',
            mb: 4
          }}
        >
          Discover Latest Models
        </Typography>
        
        {/* Filters Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="category-label">Categories</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                onChange={handleCategoryChange}
                label="Categories"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="nlp">Natural Language Processing</MenuItem>
                <MenuItem value="computer-vision">Computer Vision</MenuItem>
                <MenuItem value="generative">Generative AI</MenuItem>
                <MenuItem value="reinforcement">Reinforcement Learning</MenuItem>
                <MenuItem value="multimodal">MultiModal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value=""><em>Default</em></MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="downloads">Most Downloads</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="filter-label">Filter By</InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filterBy}
                onChange={handleFilterChange}
                label="Filter By"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="open-source">Open Source</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="research">Research</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Models Grid */}
        <Grid container spacing={3}>
          {mockModels.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <ModelCard model={model} />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      <Footer />
    </>
  );
};

export default DiscoverPage; 