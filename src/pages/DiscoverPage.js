import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  IconButton,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import { getModels } from '../services/modelService.js';

const DiscoverPage = () => {
  // State for models and loading
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for filters
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [filterBy, setFilterBy] = useState('');
  const [forceRefresh, setForceRefresh] = useState(false);
  
  // State for comparison mode
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [comparisonModels, setComparisonModels] = useState([]);
  const [compareMessage, setCompareMessage] = useState('');
  const [showCompareMessage, setShowCompareMessage] = useState(false);

  // Extract comparison mode from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const comparisonParam = params.get('comparison');
    if (comparisonParam === 'true') {
      setIsComparisonMode(true);
      
      // Get existing models from URL if any
      const modelParam = params.get('models');
      if (modelParam) {
        const modelIds = modelParam.split(',');
        setComparisonModels(modelIds);
      }
    }
  }, [location.search]);

  const loadModels = async (refresh = forceRefresh) => {
    try {
      setLoading(true);
      setError(null);
      
      // Map our UI sort options to API sort parameters
      const sortMap = {
        'trending': 'trending',
        'popular': 'likes',
        'recent': 'modified',
        'downloads': 'downloads'
      };
      
      // Prepare API options
      const options = {
        limit: 24,
        sort: sortMap[sortBy] || 'trending',
        refresh // Use the refresh parameter
      };
      
      // Add tag filter if category is selected
      if (category) {
        // Map UI categories to API tags
        const tagMap = {
          'nlp': 'natural-language-processing',
          'computer-vision': 'computer-vision',
          'generative': 'text-generation',
          'reinforcement': 'reinforcement-learning',
          'multimodal': 'multimodal'
        };
        
        if (tagMap[category]) {
          options.filter = tagMap[category];
        }
      }
      
      console.log('Fetching models with options:', options);
      const modelData = await getModels(options);
      console.log('Models loaded:', modelData.length);
      setModels(modelData);
    } catch (err) {
      console.error('Error loading models:', err);
      setError(`Failed to load models: ${err.message || 'Unknown error'}`);
      setModels([]);
    } finally {
      setLoading(false);
      // Reset force refresh state after loading
      if (forceRefresh) {
        setForceRefresh(false);
      }
    }
  };

  useEffect(() => {
    loadModels();
  }, [sortBy, category]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  const handleForceRefreshChange = (event) => {
    setForceRefresh(event.target.checked);
  };

  const handleRetry = () => {
    loadModels(true); // Force refresh on retry
  };

  // Apply additional filtering that's not supported by the API
  const filteredModels = models.filter(model => {
    if (!filterBy) return true;
    
    // Filter based on license or other criteria
    switch(filterBy) {
      case 'open-source':
        return model.tags.some(tag => 
          tag.toLowerCase().includes('open') || 
          (model.license && model.license.toLowerCase().includes('apache'))
        );
      case 'free':
        return model.tags.some(tag => tag.toLowerCase().includes('free'));
      case 'commercial':
        return model.tags.some(tag => tag.toLowerCase().includes('commercial'));
      case 'research':
        return model.tags.some(tag => tag.toLowerCase().includes('research'));
      default:
        return true;
    }
  });

  // Handle adding a model to comparison
  const handleAddToComparison = (model) => {
    if (!model || !model.id) return;
    
    // Check if already in comparison list
    if (comparisonModels.includes(model.id)) {
      setCompareMessage(`${model.name} is already in your comparison list`);
      setShowCompareMessage(true);
      return;
    }
    
    // Add to comparison (max 4 models)
    if (comparisonModels.length >= 4) {
      setCompareMessage('You can compare up to 4 models at a time');
      setShowCompareMessage(true);
      return;
    }
    
    const updatedModels = [...comparisonModels, model.id];
    setComparisonModels(updatedModels);
    setCompareMessage(`Added ${model.name} to comparison`);
    setShowCompareMessage(true);
  };
  
  // Handle removing a model from comparison
  const handleRemoveFromComparison = (modelId) => {
    const updatedModels = comparisonModels.filter(id => id !== modelId);
    setComparisonModels(updatedModels);
  };
  
  // Handle viewing the comparison
  const handleViewComparison = () => {
    if (comparisonModels.length < 2) {
      setCompareMessage('Please select at least 2 models to compare');
      setShowCompareMessage(true);
      return;
    }
    
    // Navigate to comparison page with selected models
    navigate(`/compare?models=${comparisonModels.join(',')}`);
  };
  
  // Get model name by ID for the comparison bar
  const getModelNameById = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : modelId.split('/').pop();
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#18445c',
            }}
          >
            Discover Latest Models
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isComparisonMode && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CompareArrowsIcon />}
                onClick={handleViewComparison}
                disabled={comparisonModels.length < 2}
                sx={{ mr: 2 }}
              >
                Compare ({comparisonModels.length})
              </Button>
            )}
            
            <FormControlLabel
              control={
                <Switch
                  checked={forceRefresh}
                  onChange={handleForceRefreshChange}
                  color="primary"
                />
              }
              label="Force refresh from API"
            />
          </Box>
        </Box>
        
        {/* Comparison mode indicator */}
        {isComparisonMode && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => navigate('/discover')}
              >
                Exit Comparison Mode
              </Button>
            }
          >
            You're in comparison mode. Select models to compare (max 4).
            
            {comparisonModels.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {comparisonModels.map(modelId => (
                  <Chip
                    key={modelId}
                    label={getModelNameById(modelId)}
                    onDelete={() => handleRemoveFromComparison(modelId)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Alert>
        )}
        
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
                <MenuItem value="trending">Trending</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="downloads">Most Downloads</MenuItem>
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
        
        {/* Loading indicator or error */}
        {error && (
          <Box sx={{ textAlign: 'center', py: 4, mb: 4 }}>
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        )}
        
        {/* Models Grid - always show, even during loading for better UX */}
        <Grid container spacing={3}>
          {loading && !models.length ? (
            // Show loading skeletons when loading and no models available
            Array.from(new Array(9)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <ModelCard loading={true} />
              </Grid>
            ))
          ) : (
            // Show actual models or empty state
            filteredModels.length > 0 ? (
              filteredModels.map(model => (
                <Grid item xs={12} sm={6} md={4} key={model.id}>
                  <ModelCard 
                    model={model}
                    isComparisonMode={isComparisonMode}
                    onAddToComparison={() => handleAddToComparison(model)}
                    isInComparison={comparisonModels.includes(model.id)}
                  />
                </Grid>
              ))
            ) : (
              !loading && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No models found matching your criteria. Try changing the filters.
                  </Alert>
                </Grid>
              )
            )
          )}
        </Grid>
      </Container>
      
      {/* Comparison action notification */}
      <Snackbar
        open={showCompareMessage}
        autoHideDuration={3000}
        onClose={() => setShowCompareMessage(false)}
        message={compareMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setShowCompareMessage(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      
      <Footer />
    </>
  );
};

export default DiscoverPage; 