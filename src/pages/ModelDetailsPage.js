import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  Link,
  Tab,
  Tabs,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';
import ArticleIcon from '@mui/icons-material/Article';
import GitHubIcon from '@mui/icons-material/GitHub';
import HuggingFaceIcon from '@mui/icons-material/Psychology'; // Using Psychology icon for Hugging Face
import RefreshIcon from '@mui/icons-material/Refresh';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'; // Added compare icon
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getModelById } from '../services/modelService.js';
import { saveFavorites, getFavorites } from '../services/huggingFaceService';
import { format } from 'date-fns';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ModelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [liked, setLiked] = useState(false);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };
  
  const fetchModelDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching model with ID: ${id}`);
      
      const decodedModelId = decodeURIComponent(id);
      // Use refresh parameter based on forceRefresh state
      const modelData = await getModelById(decodedModelId, forceRefresh);
      
      console.log('Model data fetched successfully');
      setModel(modelData);
      
      // Check if user has liked this model
      if (currentUser) {
        const favorites = getFavorites(currentUser.uid);
        setLiked(favorites.includes(decodedModelId));
      }
    } catch (err) {
      console.error('Error fetching model details:', err);
      setError(`Failed to load model details: ${err.message || 'Unknown error'}`);
      setModel(null);
    } finally {
      setLoading(false);
      // Reset force refresh after loading
      if (forceRefresh) {
        setForceRefresh(false);
      }
    }
  };
  
  useEffect(() => {
    fetchModelDetails();
  }, [id, currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLikeClick = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      const decodedModelId = decodeURIComponent(id);
      const favorites = getFavorites(currentUser.uid);
      
      let updatedFavorites;
      if (liked) {
        // Remove from favorites
        updatedFavorites = favorites.filter(favId => favId !== decodedModelId);
      } else {
        // Add to favorites
        updatedFavorites = [...favorites, decodedModelId];
      }
      
      // Save updated favorites
      saveFavorites(currentUser.uid, updatedFavorites);
      
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleForceRefreshChange = (event) => {
    setForceRefresh(event.target.checked);
  };

  const handleRetry = () => {
    // Force refresh on retry
    setForceRefresh(true);
    fetchModelDetails();
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading model details...
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
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ mr: 2 }}
          >
            Retry
          </Button>
          <Button 
            variant="outlined"
            color="primary" 
            onClick={() => navigate('/discover')}
          >
            Back to Discover
          </Button>
        </Container>
        <Footer />
      </>
    );
  }
  
  if (!model) {
    return (
      <>
        <Header />
        <Container sx={{ py: 10, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Model not found
          </Alert>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/discover')}
          >
            Back to Discover
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  // Generate sample Python code for using the model
  const generatePythonCode = () => {
    if (!model || !model.id) return 'Error: Model ID not available';
    
    return `
# Install dependencies
!pip install transformers

# Import libraries
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_id = "${model.id}"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

# Generate text
inputs = tokenizer("Hello, I'm a language model", return_tensors="pt")
outputs = model.generate(**inputs, max_length=50)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
`;
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Back button and controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="text"
            startIcon={<RefreshIcon />}
            onClick={() => navigate('/discover')}
          >
            Back to Discover
          </Button>
          
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
        
        {/* Model Header */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                backgroundColor: '#f8f9fa'
              }}
            >
              <Box
                component="img"
                src={model.imageUrl || 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg'}
                alt={model.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg';
                }}
              />
            </Paper>
            
            {/* Action buttons */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
                component={Link}
                href={model.huggingFaceUrl}
                target="_blank"
                sx={{ 
                  borderRadius: 20,
                  fontWeight: 500
                }}
              >
                View on Hugging Face
              </Button>
              
              <Button 
                variant={liked ? "outlined" : "contained"}
                color={liked ? "secondary" : "primary"}
                fullWidth
                startIcon={<FavoriteIcon />}
                onClick={handleLikeClick}
                sx={{ 
                  borderRadius: 20,
                  fontWeight: 500
                }}
              >
                {liked ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              
              {/* Added Compare Button */}
              <Button 
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<CompareArrowsIcon />}
                onClick={() => navigate(`/compare?models=${encodeURIComponent(model.id)}`)}
                sx={{ 
                  borderRadius: 20,
                  fontWeight: 500
                }}
              >
                Compare With Others
              </Button>
            </Stack>
            
            {/* Model Stats */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Model Stats
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Downloads
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatNumber(model.downloadCount || 0)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Likes
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatNumber(model.likes || 0)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatDate(model.lastUpdated)}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary">
                  License
                </Typography>
                <Typography variant="body2">
                  {model.license || 'Not specified'}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary">
                Last Fetched
              </Typography>
              <Typography variant="body2">
                {formatDate(model.lastFetched)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ mb: 2, fontWeight: 700 }}
              >
                {model.name}
              </Typography>
              
              <Chip 
                label={model.author} 
                size="small" 
                sx={{ mb: 3 }} 
              />
              
              <Box mb={3}>
                {model.tags && model.tags.length > 0 ? (
                  model.tags.map((tag, i) => (
                    <Chip 
                      key={i} 
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags available
                  </Typography>
                )}
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Description
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {model.description || 'No description available'}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1">
                  Developed by {model.author}, this model has been downloaded {formatNumber(model.downloadCount)} times and 
                  received {formatNumber(model.likes)} likes from the community. The model was last updated on {formatDate(model.lastUpdated)}.
                </Typography>
              </Box>
              
              {(model.githubUrl || model.paperUrl) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    External Resources
                  </Typography>
                  
                  <Stack direction="row" spacing={2}>
                    {model.githubUrl && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<GitHubIcon />}
                        component={Link}
                        href={model.githubUrl}
                        target="_blank"
                      >
                        GitHub
                      </Button>
                    )}
                    
                    {model.paperUrl && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<ArticleIcon />}
                        component={Link}
                        href={model.paperUrl}
                        target="_blank"
                      >
                        Research Paper
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}
            </Paper>
            
            {/* Tabs Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                border: '1px solid #e0e0e0',
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                }}
                variant="fullWidth"
              >
                <Tab label="Usage" />
                <Tab label="Similar Models" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  How to Use This Model
                </Typography>
                
                <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        overflowX: 'auto',
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                      }}
                    >
                      {generatePythonCode()}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography variant="body2" color="text.secondary">
                  For more detailed examples and documentation, please visit the{' '}
                  <Link href={model.huggingFaceUrl} target="_blank" rel="noopener noreferrer">
                    Hugging Face model page
                  </Link>.
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                  Similar models information will be available in a future update.
                </Typography>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </>
  );
};

export default ModelDetailsPage; 