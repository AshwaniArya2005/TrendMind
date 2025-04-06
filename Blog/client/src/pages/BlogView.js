import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  VolumeUp as VolumeUpIcon, 
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { blogService, modelService } from '../services/api';

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogData = await blogService.getBlogByModelId(id);
        setBlog(blogData);
        
        // Fetch model details
        const modelData = await modelService.getModelById(id);
        setModel(modelData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);
  
  const handleGenerateBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.generateBlog(id);
      setBlog(response.blog);
      
      setNotification({
        open: true,
        message: 'Blog regenerated successfully!',
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating blog:', err);
      setError('Failed to generate blog. Please try again later.');
      setLoading(false);
      
      setNotification({
        open: true,
        message: 'Failed to generate blog. Please try again.',
        severity: 'error'
      });
    }
  };
  
  const handleRegenerateAudio = async () => {
    try {
      setAudioLoading(true);
      const response = await blogService.regenerateAudio(blog._id);
      
      // Update blog with new audio URL
      setBlog({
        ...blog,
        audioUrl: response.audioUrl
      });
      
      setNotification({
        open: true,
        message: 'Audio regenerated successfully!',
        severity: 'success'
      });
      
      setAudioLoading(false);
    } catch (err) {
      console.error('Error regenerating audio:', err);
      
      setNotification({
        open: true,
        message: 'Failed to regenerate audio. Please try again.',
        severity: 'error'
      });
      
      setAudioLoading(false);
    }
  };
  
  const handlePlayAudio = () => {
    if (blog?.audioUrl) {
      const audio = new Audio(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${blog.audioUrl}`);
      audio.play();
    } else {
      setNotification({
        open: true,
        message: 'Audio is not available for this blog.',
        severity: 'info'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading blog...
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
  
  // If blog is not found, show option to generate one
  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          No blog found for this AI model.
        </Alert>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGenerateBlog}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Blog'}
            {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Button>
        </Box>
      </Container>
    );
  }
  
  // Format blog content to render markdown-like content
  const formatContent = (content) => {
    if (!content) return '';
    
    // Split by double newlines to separate paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a heading
      if (paragraph.startsWith('# ')) {
        return (
          <Typography variant="h4" gutterBottom key={index} sx={{ mt: 4 }}>
            {paragraph.substring(2)}
          </Typography>
        );
      } else if (paragraph.startsWith('## ')) {
        return (
          <Typography variant="h5" gutterBottom key={index} sx={{ mt: 3 }}>
            {paragraph.substring(3)}
          </Typography>
        );
      } else if (paragraph.startsWith('### ')) {
        return (
          <Typography variant="h6" gutterBottom key={index} sx={{ mt: 2 }}>
            {paragraph.substring(4)}
          </Typography>
        );
      } else {
        return (
          <Typography paragraph key={index} sx={{ mb: 2 }}>
            {paragraph}
          </Typography>
        );
      }
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        {model && (
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {model.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {model.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={model.category} color="primary" size="small" />
                    {model.accuracy && (
                      <Chip label={`Accuracy: ${model.accuracy}%`} color="secondary" size="small" />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={handleGenerateBlog}
                      disabled={loading}
                      sx={{ mb: 1 }}
                    >
                      Regenerate Blog
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={handlePlayAudio} 
                      disabled={!blog.audioUrl || audioLoading}
                      aria-label="play audio"
                    >
                      <VolumeUpIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      onClick={handleRegenerateAudio} 
                      disabled={audioLoading}
                      aria-label="regenerate audio"
                    >
                      {audioLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                    <IconButton color="primary" aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Generated Version: {blog.version} | Last Updated: {new Date(blog.lastGeneratedAt).toLocaleDateString()}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ typography: 'body1' }}>
          {formatContent(blog.content)}
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            startIcon={<VolumeUpIcon />} 
            onClick={handlePlayAudio}
            disabled={!blog.audioUrl || audioLoading}
          >
            Listen to Audio
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RefreshIcon />}
            onClick={handleRegenerateAudio}
            disabled={audioLoading}
          >
            {audioLoading ? 'Generating Audio...' : 'Regenerate Audio'}
            {audioLoading && <CircularProgress size={24} sx={{ ml: 1 }} color="inherit" />}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogView; 