import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getModelById } from '../services/modelService';
import { format } from 'date-fns';

const ComparisonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format helper functions
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse model IDs from URL
        const params = new URLSearchParams(location.search);
        const modelIds = params.get('models') ? params.get('models').split(',') : [];

        if (modelIds.length === 0) {
          setError('No models selected for comparison');
          setLoading(false);
          return;
        }

        // Fetch each model details
        const modelPromises = modelIds.map(id => getModelById(decodeURIComponent(id)));
        const modelResults = await Promise.all(modelPromises);
        
        // Filter out any null results (failed fetches)
        const validModels = modelResults.filter(model => model !== null);
        
        if (validModels.length === 0) {
          setError('Failed to load any of the selected models');
        } else {
          setModels(validModels);
        }
      } catch (err) {
        console.error('Error fetching models for comparison:', err);
        setError(`Error loading models: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [location.search]);

  const handleRemoveModel = (modelToRemove) => {
    const updatedModels = models.filter(model => model.id !== modelToRemove.id);
    
    if (updatedModels.length === 0) {
      // If no models left, navigate back to discover page
      navigate('/discover');
      return;
    }
    
    // Update URL with new model list
    const modelIds = updatedModels.map(model => encodeURIComponent(model.id)).join(',');
    navigate(`/compare?models=${modelIds}`);
    
    // Update state
    setModels(updatedModels);
  };

  const handleAddModel = () => {
    // Navigate to discover page with option to add to comparison
    navigate('/discover?comparison=true');
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading models for comparison...
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/discover')}
          >
            Back to Discover
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/discover')}
              sx={{ mr: 2 }}
            >
              Back to Discover
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Model Comparison
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddModel}
            color="primary"
          >
            Add Model
          </Button>
        </Box>

        {/* Model Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {models.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <IconButton
                  aria-label="remove from comparison"
                  onClick={() => handleRemoveModel(model)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#f8f9fa', height: 160 }}>
                  <CardMedia
                    component="img"
                    image={model.imageUrl || 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg'}
                    alt={model.name}
                    sx={{ 
                      width: 'auto', 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {model.name}
                  </Typography>
                  <Chip 
                    label={model.author} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {model.description?.length > 100 
                      ? `${model.description.substring(0, 100)}...` 
                      : model.description}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    component={Link}
                    href={`/model/${encodeURIComponent(model.id)}`}
                    sx={{ mt: 'auto' }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Comparison Table */}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Side-by-Side Comparison
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 6, overflow: 'hidden' }}>
          <Table aria-label="model comparison table">
            <TableHead sx={{ bgcolor: '#f0f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Feature</TableCell>
                {models.map(model => (
                  <TableCell key={model.id} sx={{ fontWeight: 'bold' }}>
                    {model.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Author */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  Author
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-author`}>
                    {model.author}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Last Updated */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  Last Updated
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-updated`}>
                    {formatDate(model.lastUpdated)}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Downloads */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  Downloads
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-downloads`}>
                    {formatNumber(model.downloadCount)}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Likes */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  Likes
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-likes`}>
                    {formatNumber(model.likes)}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* License */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  License
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-license`}>
                    {model.license || 'Not specified'}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Tags */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  Tags
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-tags`}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {model.tags && model.tags.length > 0 ? (
                        model.tags.map((tag, i) => (
                          <Chip 
                            key={i} 
                            label={tag}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No tags
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
              
              {/* External Links */}
              <TableRow>
                <TableCell component="th" scope="row" sx={{ bgcolor: '#f8f9fa', fontWeight: 500 }}>
                  External Links
                </TableCell>
                {models.map(model => (
                  <TableCell key={`${model.id}-links`}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        component={Link}
                        href={model.huggingFaceUrl}
                        target="_blank"
                        sx={{ mr: 1, mb: 1 }}
                      >
                        Hugging Face
                      </Button>
                      
                      {model.githubUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          component={Link}
                          href={model.githubUrl}
                          target="_blank"
                          sx={{ mr: 1, mb: 1 }}
                        >
                          GitHub
                        </Button>
                      )}
                      
                      {model.paperUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          component={Link}
                          href={model.paperUrl}
                          target="_blank"
                          sx={{ mb: 1 }}
                        >
                          Paper
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Performance Comparison - Placeholder for future feature */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Performance Metrics Comparison
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Performance metrics comparison will be available in a future update. This feature will include benchmark results, inference speed, memory usage, and other technical metrics.
          </Typography>
        </Paper>
        
        {/* Use Case Recommendations */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Use Case Recommendations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            Based on the models you're comparing, here are recommended use cases for each:
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {models.map(model => (
              <Grid item xs={12} md={6} key={`${model.id}-usecase`}>
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {model.name}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {generateUseCaseText(model)}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Best suited for:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {generateBestUseCases(model).map((useCase, index) => (
                        <Chip 
                          key={index} 
                          label={useCase}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
      
      <Footer />
    </>
  );
};

// Helper function to generate use case text based on model tags
const generateUseCaseText = (model) => {
  const tags = model.tags || [];
  const tagLowerCase = tags.map(tag => tag.toLowerCase());
  
  if (tagLowerCase.includes('text-generation')) {
    return `${model.name} is well-suited for text generation tasks including content creation, chatbots, and creative writing applications.`;
  } else if (tagLowerCase.includes('text-to-image')) {
    return `${model.name} excels at creating images from text descriptions, making it ideal for creative design, content generation, and visualization tasks.`;
  } else if (tagLowerCase.includes('sentence-similarity') || tagLowerCase.includes('feature-extraction')) {
    return `${model.name} is optimized for understanding and comparing text semantics, making it excellent for search applications, recommendation systems, and content organization.`;
  } else if (tagLowerCase.includes('text-classification')) {
    return `${model.name} performs well for categorizing text into predefined classes, useful for sentiment analysis, topic classification, and content moderation.`;
  } else if (tagLowerCase.includes('question-answering')) {
    return `${model.name} is designed to provide accurate answers to questions, making it suitable for customer support systems, knowledge bases, and educational tools.`;
  } else {
    return `${model.name} is a versatile model that can be applied to various tasks in the ${tags.join(', ')} domains.`;
  }
};

// Helper function to generate best use cases based on model properties
const generateBestUseCases = (model) => {
  const tags = model.tags || [];
  const tagLowerCase = tags.map(tag => tag.toLowerCase());
  const useCases = [];
  
  if (tagLowerCase.includes('text-generation')) {
    useCases.push('Content Creation', 'Chatbots', 'Creative Writing');
  }
  
  if (tagLowerCase.includes('text-to-image')) {
    useCases.push('Image Generation', 'Design', 'Visualization');
  }
  
  if (tagLowerCase.includes('sentence-similarity') || tagLowerCase.includes('feature-extraction')) {
    useCases.push('Semantic Search', 'Recommendations', 'Content Organization');
  }
  
  if (tagLowerCase.includes('text-classification')) {
    useCases.push('Sentiment Analysis', 'Topic Classification', 'Content Moderation');
  }
  
  if (tagLowerCase.includes('question-answering')) {
    useCases.push('Q&A Systems', 'Knowledge Bases', 'Educational Tools');
  }
  
  if (tagLowerCase.includes('translation')) {
    useCases.push('Language Translation', 'Localization', 'Multi-lingual Content');
  }
  
  if (tagLowerCase.includes('summarization')) {
    useCases.push('Text Summarization', 'Content Briefing', 'Document Analysis');
  }
  
  // If no specific use cases could be determined, add generic ones
  if (useCases.length === 0) {
    useCases.push('General Purpose', 'Research', 'Experimentation');
  }
  
  return useCases.slice(0, 5); // Return max 5 use cases
};

export default ComparisonPage; 