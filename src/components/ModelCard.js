import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, Chip, Stack, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { saveFavorites, getFavorites } from '../services/huggingFaceService';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#f0f4f8',
  border: 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 160,
  backgroundSize: 'contain',
  backgroundColor: '#e8f1f8',
  backgroundPosition: 'center',
  padding: '20px',
}));

// CORS proxy fallback for image loading
const CORS_PROXY = 'https://images.weserv.nl/?url=';

// Add a shimmer effect for loading state
const ShimmerEffect = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  animation: '$shimmer 1.5s infinite linear',
  background: 'linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%)',
  backgroundSize: '1000px 100%',
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-500px 0',
    },
    '100%': {
      backgroundPosition: '500px 0',
    },
  },
}));

const FavoriteIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 20,
  padding: '6px 16px',
  fontSize: '0.85rem',
  fontWeight: 500,
  minWidth: '100px',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#d8e6f3',
  color: '#2a5d8f',
  fontSize: '0.75rem',
  height: 24,
  borderRadius: 12,
  fontWeight: 500,
  '& .MuiChip-label': {
    padding: '0 10px',
  },
}));

const MetricChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: '#546e7a',
  marginRight: '12px',
  '& svg': {
    fontSize: '14px',
    marginRight: '4px',
    opacity: 0.8,
  }
}));

// Format large numbers with K, M suffixes
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const ModelCard = ({ 
  model, 
  loading = false, 
  isComparisonMode = false, 
  onAddToComparison = () => {}, 
  isInComparison = false 
}) => {
  const { currentUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [safeModel, setSafeModel] = useState({
    id: 'unknown',
    name: 'Unknown Model',
    description: 'No description available',
    author: 'Unknown Author',
    imageUrl: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    tags: [],
    downloadCount: 0,
    likes: 0,
    huggingFaceUrl: 'https://huggingface.co',
  });

  // Check for null or undefined model and prepare safe model on mount
  useEffect(() => {
    if (!model) {
      console.warn('ModelCard received null or undefined model');
      return;
    }

    // Create safe model with defaults
    setSafeModel({
      id: model.id || 'unknown',
      name: model.name || 'Unknown Model',
      description: model.description || 'No description available',
      author: model.author || 'Unknown Author',
      imageUrl: model.imageUrl || 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
      tags: Array.isArray(model.tags) ? model.tags : [],
      downloadCount: model.downloadCount || 0,
      likes: model.likes || 0,
      huggingFaceUrl: model.huggingFaceUrl || 'https://huggingface.co',
      ...model
    });
    
    // Reset image states when model changes
    setImageLoaded(false);
    setImageError(false);
  }, [model]);

  // Try to generate a CORS-compatible image URL
  const getProxiedImageUrl = (originalUrl) => {
    if (!originalUrl) return 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg';
    
    // First, try to use HTTPS version
    let url = originalUrl.replace('http://', 'https://');
    
    // If it's already a proxied URL, don't double-proxy it
    if (url.includes(CORS_PROXY)) return url;
    
    // Remove protocol for the proxy
    url = url.replace('https://', '');
    
    return `${CORS_PROXY}${url}`;
  };

  // Preload image
  useEffect(() => {
    if (safeModel.imageUrl) {
      // Try direct loading first
      const directImg = new Image();
      directImg.onload = () => setImageLoaded(true);
      directImg.onerror = () => {
        console.warn(`Failed to load image directly for model: ${safeModel.id}, trying proxy...`);
        
        // If direct loading fails, try proxy
        const proxyImg = new Image();
        proxyImg.onload = () => setImageLoaded(true);
        proxyImg.onerror = () => {
          setImageError(true);
          console.warn(`Failed to load image via proxy for model: ${safeModel.id}`);
        };
        proxyImg.crossOrigin = "anonymous";
        proxyImg.src = getProxiedImageUrl(safeModel.imageUrl);
      };
      
      // Try to load the image with a cache-busting query parameter
      const cacheBuster = `?t=${Date.now()}`;
      directImg.crossOrigin = "anonymous";
      directImg.src = `${safeModel.imageUrl}${cacheBuster}`;
    }
  }, [safeModel.imageUrl, safeModel.id]);

  // Check favorites status
  useEffect(() => {
    if (currentUser && safeModel.id !== 'unknown') {
      const favorites = getFavorites(currentUser.uid);
      setIsFavorite(favorites.includes(safeModel.id));
    }
  }, [currentUser, safeModel.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation to detail page
    
    if (!currentUser || safeModel.id === 'unknown') return;
    
    try {
      // Get current favorites from localStorage
      const favorites = getFavorites(currentUser.uid);
      
      let updatedFavorites;
      if (isFavorite) {
        // Remove from favorites
        updatedFavorites = favorites.filter(id => id !== safeModel.id);
      } else {
        // Add to favorites
        updatedFavorites = [...favorites, safeModel.id];
      }
      
      // Save updated favorites to localStorage
      saveFavorites(currentUser.uid, updatedFavorites);
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  // If component is in loading state, show skeleton
  if (loading) {
    return (
      <StyledCard>
        <Box sx={{ position: 'relative' }}>
          <ShimmerEffect sx={{ height: 160 }} />
        </Box>
        <CardContent>
          <ShimmerEffect sx={{ height: 24, width: '80%', mb: 1 }} />
          <ShimmerEffect sx={{ height: 16, width: '100%', mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShimmerEffect sx={{ height: 20, width: 80, mr: 1 }} />
            <ShimmerEffect sx={{ height: 20, width: 80 }} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
            <ShimmerEffect sx={{ height: 24, width: 60, mr: 1, mb: 1 }} />
            <ShimmerEffect sx={{ height: 24, width: 80, mr: 1, mb: 1 }} />
            <ShimmerEffect sx={{ height: 24, width: 70, mb: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
            <ShimmerEffect sx={{ height: 36, width: 120 }} />
            <ShimmerEffect sx={{ height: 36, width: 120 }} />
          </Box>
        </CardContent>
      </StyledCard>
    );
  }

  // If no model is provided, don't render anything
  if (!model) {
    return null;
  }

  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        {!imageLoaded && !imageError ? (
          <ShimmerEffect sx={{ height: 160 }} />
        ) : (
        <StyledCardMedia
            image={imageError ? 
              'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' : 
              (imageLoaded ? safeModel.imageUrl : getProxiedImageUrl(safeModel.imageUrl))
            }
            title={safeModel.name}
            onError={() => setImageError(true)}
          />
        )}
        <FavoriteIconButton
          size="small"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
        >
          {isFavorite ? 
            <StarIcon sx={{ fontSize: 18, color: '#18445c' }} /> : 
            <StarBorderIcon sx={{ fontSize: 18 }} />
          }
        </FavoriteIconButton>
        
        {/* Add visual indicator if model is selected for comparison */}
        {isInComparison && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8, 
              bgcolor: 'primary.main', 
              color: 'white',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <CheckCircleIcon fontSize="small" />
          </Box>
        )}
        
        {/* Author name overlay */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            bgcolor: 'rgba(0,0,0,0.6)', 
            color: 'white',
            p: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {safeModel.author}
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#333',
            mb: 1
          }}
        >
          {safeModel.name}
        </Typography>
        
        {/* One line description with ellipsis */}
        <Tooltip title={safeModel.description} placement="top">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
              flexGrow: 0,
            fontSize: '0.85rem',
            lineHeight: 1.5,
              color: '#546e7a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {safeModel.description}
        </Typography>
        </Tooltip>
        
        {/* Model stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MetricChip>
            <DownloadIcon />
            {formatNumber(safeModel.downloadCount)}
          </MetricChip>
          <MetricChip>
            <FavoriteIcon />
            {formatNumber(safeModel.likes)}
          </MetricChip>
        </Box>
        
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mb: 2 }}>
          {safeModel.tags.slice(0, 3).map((tag, index) => (
            <StyledChip 
              key={index} 
              label={tag} 
              size="small"
              sx={{ mr: 0.5, mb: 0.75 }}
            />
          ))}
        </Stack>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 'auto' 
        }}>
          <StyledButton 
            variant="contained" 
            color="primary" 
            component={Link}
            to={`/model/${encodeURIComponent(safeModel.id)}`}
            sx={{ 
              backgroundColor: '#18445c',
              '&:hover': {
                backgroundColor: '#0d3242',
              }
            }}
          >
            View Details
          </StyledButton>
          
          {isComparisonMode ? (
            <StyledButton 
              variant={isInComparison ? "contained" : "outlined"}
              color={isInComparison ? "secondary" : "primary"}
              onClick={() => onAddToComparison(safeModel)}
              disabled={isInComparison}
              startIcon={isInComparison ? <CheckCircleIcon /> : <CompareArrowsIcon />}
              sx={{
                ...(isInComparison ? {
                  backgroundColor: '#db7093',
                  '&:hover': {
                    backgroundColor: '#db7093',
                  }
                } : {
                  borderColor: '#18445c',
                  color: '#18445c',
                  '&:hover': {
                    borderColor: '#0d3242',
                    backgroundColor: 'rgba(24, 68, 92, 0.04)',
                  }
                })
              }}
            >
              {isInComparison ? 'Added' : 'Add'}
            </StyledButton>
          ) : (
            <StyledButton 
              variant="outlined"
              color="primary"
              component={Link}
              to={`/compare?models=${encodeURIComponent(safeModel.id)}`}
              sx={{ 
                borderColor: '#18445c',
                color: '#18445c', 
                '&:hover': {
                  borderColor: '#0d3242',
                  backgroundColor: 'rgba(24, 68, 92, 0.04)',
                }
              }}
            >
              Compare
            </StyledButton>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ModelCard; 