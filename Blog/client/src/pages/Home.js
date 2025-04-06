import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert
} from '@mui/material';
import { modelService } from '../services/api';

const categories = [
  'All',
  'Computer Vision',
  'Natural Language Processing',
  'Generative AI',
  'Reinforcement Learning',
  'Audio Processing',
  'Multimodal',
  'Other'
];

const Home = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const filters = {};
        
        if (category !== 'All') {
          filters.category = category;
        }
        
        if (search) {
          filters.search = search;
        }
        
        const data = await modelService.getModels(filters);
        setModels(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load AI models. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [category, search]);
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  const getCardColor = (model) => {
    if (!model.accuracy) return '';
    
    if (model.accuracy >= 90) return '#e8f5e9'; // Light green for high accuracy
    if (model.accuracy >= 80) return '#f1f8e9'; // Lighter green for good accuracy
    if (model.accuracy >= 70) return '#fffde7'; // Light yellow for moderate accuracy
    return '#ffebee'; // Light red for lower accuracy
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading AI Models...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Model Blog Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover the latest AI models and read AI-generated blogs about them
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search AI Models"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {models.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>
          No AI models found matching the current filters.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {models.map((model) => (
            <Grid item key={model._id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: getCardColor(model),
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {model.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Chip 
                      label={model.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                    {model.accuracy && (
                      <Chip 
                        label={`${model.accuracy}% Accuracy`} 
                        size="small" 
                        color="secondary" 
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {model.description.length > 120
                      ? `${model.description.substring(0, 120)}...`
                      : model.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    {model.keyFeatures && model.keyFeatures.slice(0, 3).map((feature, index) => (
                      <Typography key={index} variant="body2" component="div" sx={{ mb: 0.5 }}>
                        • {feature}
                      </Typography>
                    ))}
                    {model.keyFeatures && model.keyFeatures.length > 3 && (
                      <Typography variant="body2" color="text.secondary">
                        +{model.keyFeatures.length - 3} more features
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/models/${model._id}`}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/blogs/${model._id}`}
                    color="primary"
                  >
                    Read Blog
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home; 