import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton, Chip, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 180,
  backgroundSize: 'contain',
  backgroundColor: '#f5f8fa',
  borderBottom: '1px solid #eaeef3',
}));

const InfoIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 20,
  padding: '6px 16px',
}));

const ModelCard = ({ model }) => {
  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
          image={model.imageUrl || 'https://via.placeholder.com/300x180?text=AI+Model'}
          title={model.name}
        />
        <InfoIconButton
          size="small"
          component={Link}
          to={`/model/${model.id}`}
          aria-label="model details"
        >
          <InfoIcon />
        </InfoIconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {model.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {model.description.length > 100 
            ? `${model.description.substring(0, 100)}...` 
            : model.description}
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {model.tags && model.tags.slice(0, 3).map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              sx={{ 
                backgroundColor: '#e8f4fd', 
                color: '#0277bd',
                mb: 1
              }} 
            />
          ))}
        </Stack>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StyledButton 
            variant="contained" 
            color="primary" 
            component={Link}
            to={`/model/${model.id}`}
          >
            Read More
          </StyledButton>
          
          {model.compareEnabled && (
            <StyledButton 
              variant="outlined" 
              color="primary"
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