import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';
import ArticleIcon from '@mui/icons-material/Article';
import GitHubIcon from '@mui/icons-material/GitHub';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock detailed model data - in a real app, you'd fetch this based on params.id
const modelDetails = {
  id: 1,
  name: 'ViT-GPT2',
  description: 'A powerful multi-modal model that combines vision transformers with GPT-2 for image captioning and visual question answering.',
  longDescription: `
    ViT-GPT2 is a cutting-edge model that combines the power of Vision Transformers (ViT) with the language generation capabilities of GPT-2. 
    This model excels at converting visual data into natural language descriptions and can handle a variety of tasks including:
    
    - Generating detailed image captions
    - Answering questions about image content
    - Creating stories based on visual scenes
    - Describing complex visual relationships
    
    The model was trained on a diverse dataset of image-text pairs to ensure broad coverage of domains and scenarios.
  `,
  type: 'Multi-modal',
  tags: ['Vision', 'NLP', 'Transformers', 'Image Captioning', 'Visual QA'],
  author: 'OpenAI Research Team',
  downloadCount: 125780,
  likes: 4528,
  lastUpdated: '2023-09-15',
  license: 'MIT',
  imageUrl: '/assets/model1.png',
  huggingFaceUrl: 'https://huggingface.co/models/vit-gpt2',
  githubUrl: 'https://github.com/openai/vit-gpt2',
  paperUrl: 'https://arxiv.org/abs/xxxx.xxxxx',
  performance: {
    accuracy: 87.6,
    speed: 'Fast',
    memoryUsage: 'Medium',
    metrics: [
      { name: 'BLEU-4', value: 36.9 },
      { name: 'ROUGE-L', value: 58.2 },
      { name: 'CIDEr', value: 123.5 },
    ],
  },
  usage: `
    # Installation
    \`\`\`python
    pip install vit-gpt2
    \`\`\`
    
    # Basic usage
    \`\`\`python
    from vit_gpt2 import ViTGPT2Model
    
    model = ViTGPT2Model.from_pretrained("openai/vit-gpt2")
    image = load_image("example.jpg")
    
    # Generate caption
    caption = model.generate_caption(image)
    print(caption)
    
    # Answer question about image
    answer = model.answer_question(image, "What is in the foreground?")
    print(answer)
    \`\`\`
  `,
  relatedModels: [
    { id: 2, name: 'DETR', description: 'End-to-End Object Detection with Transformers' },
    { id: 3, name: 'CLIP', description: 'Connecting Text and Images' },
    { id: 4, name: 'DALL-E', description: 'Creating Images from Text' },
  ],
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ModelDetailsPage = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [liked, setLiked] = useState(false);
  
  // Mock loading the model based on ID - in real app this would fetch from API
  useEffect(() => {
    // In real app: fetch model details based on id
    console.log(`Loading model with id: ${id}`);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
                src={modelDetails.imageUrl || 'https://via.placeholder.com/300x300?text=AI+Model'}
                alt={modelDetails.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Paper>
            
            {/* Action buttons */}
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
              >
                Download Model
              </Button>
              
              <Button 
                variant="outlined" 
                color={liked ? "secondary" : "primary"}
                fullWidth
                startIcon={<FavoriteIcon />}
                onClick={handleLikeClick}
              >
                {liked ? 'Liked' : 'Like Model'}
              </Button>
            </Stack>
            
            {/* Model Quick Info */}
            <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom>
                Model Type
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.type}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Author
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.author}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                License
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.license}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Downloads
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.downloadCount.toLocaleString()}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Likes
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.likes.toLocaleString()}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {modelDetails.lastUpdated}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Links
              </Typography>
              <Stack spacing={1} direction="row" sx={{ mb: 1 }}>
                {modelDetails.huggingFaceUrl && (
                  <Link href={modelDetails.huggingFaceUrl} target="_blank" rel="noopener">
                    <Chip icon={<LinkIcon />} label="Hugging Face" clickable size="small" />
                  </Link>
                )}
                {modelDetails.githubUrl && (
                  <Link href={modelDetails.githubUrl} target="_blank" rel="noopener">
                    <Chip icon={<GitHubIcon />} label="GitHub" clickable size="small" />
                  </Link>
                )}
                {modelDetails.paperUrl && (
                  <Link href={modelDetails.paperUrl} target="_blank" rel="noopener">
                    <Chip icon={<ArticleIcon />} label="Paper" clickable size="small" />
                  </Link>
                )}
              </Stack>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Model Name and Description */}
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              {modelDetails.name}
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph
              sx={{ mb: 3 }}
            >
              {modelDetails.description}
            </Typography>
            
            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {modelDetails.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    sx={{ 
                      backgroundColor: '#e8f4fd', 
                      color: '#0277bd',
                      m: 0.5
                    }} 
                  />
                ))}
              </Stack>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Tabs for different sections */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  aria-label="model details tabs"
                >
                  <Tab label="Overview" id="model-tab-0" />
                  <Tab label="Usage" id="model-tab-1" />
                  <Tab label="Performance" id="model-tab-2" />
                  <Tab label="Related Models" id="model-tab-3" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {modelDetails.longDescription}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography 
                  variant="body1" 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto'
                  }}
                >
                  {modelDetails.usage}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.accuracy}%
                      </Typography>
                      <Typography variant="body2">
                        Accuracy
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.speed}
                      </Typography>
                      <Typography variant="body2">
                        Inference Speed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="h5" color="primary" gutterBottom>
                        {modelDetails.performance.memoryUsage}
                      </Typography>
                      <Typography variant="body2">
                        Memory Usage
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom>
                  Additional Metrics
                </Typography>
                <Grid container spacing={2}>
                  {modelDetails.performance.metrics.map((metric, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Typography variant="h6" color="primary" gutterBottom>
                          {metric.value}
                        </Typography>
                        <Typography variant="body2">
                          {metric.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                  {modelDetails.relatedModels.map((model) => (
                    <Grid item xs={12} sm={6} key={model.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          height: '100%',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {model.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {model.description}
                          </Typography>
                          <Button 
                            variant="text" 
                            color="primary" 
                            sx={{ mt: 2 }} 
                            href={`/model/${model.id}`}
                          >
                            View Model
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </>
  );
};

export default ModelDetailsPage; 