import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Link,
  CircularProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Article as ArticleIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { modelService } from '../services/api';

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [model, setModel] = useState(null);
  const [similarModels, setSimilarModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        
        // Fetch model details
        const modelData = await modelService.getModelById(id);
        setModel(modelData);
        
        // Fetch similar models
        const similarsData = await modelService.getSimilarModels(id);
        setSimilarModels(similarsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching model details:', err);
        setError('Failed to load model details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchModelData();
  }, [id]);
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading model details...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!model) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Model not found.
        </Alert>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/"
            startIcon={<ArrowBackIcon />}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Back
      </Button>
      
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {model.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={model.category} color="primary" />
                {model.accuracy && (
                  <Chip label={`Accuracy: ${model.accuracy}%`} color="secondary" />
                )}
                {model.releaseDate && (
                  <Chip 
                    label={`Released: ${new Date(model.releaseDate).toLocaleDateString()}`} 
                    variant="outlined" 
                  />
                )}
              </Box>
              
              <Typography variant="body1" paragraph>
                {model.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to={`/blogs/${model._id}`}
                startIcon={<ArticleIcon />}
              >
                Read AI-Generated Blog
              </Button>
              
              {model.githubUrl && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  href={model.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<CodeIcon />}
                >
                  GitHub Repository
                </Button>
              )}
              
              {model.paperUrl && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  href={model.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<DescriptionIcon />}
                >
                  Research Paper
                </Button>
              )}
              
              {model.datasetUrl && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  href={model.datasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<StorageIcon />}
                >
                  Dataset
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {model.keyFeatures && model.keyFeatures.length > 0 ? (
              <List>
                {model.keyFeatures.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <BookmarkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No key features listed for this model.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {similarModels.length > 0 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Similar Models
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {similarModels.map((similar) => (
                  <ListItem 
                    key={similar._id}
                    component={RouterLink}
                    to={`/models/${similar._id}`}
                    button
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={similar.name}
                      secondary={similar.description.substring(0, 60) + '...'}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ModelDetail; 