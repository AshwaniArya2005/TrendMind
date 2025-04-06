import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { authService, modelService, blogService } from '../services/api';

// TabPanel component for handling tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [models, setModels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    
    // Fetch models and blogs
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch only the user's models
        // and blogs or use a more specialized endpoint
        const modelsData = await modelService.getModels();
        setModels(modelsData);
        
        const blogsData = await blogService.getBlogs();
        setBlogs(blogsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: 'primary.main' 
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4">
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.isPremium ? 'Premium Member' : 'Standard Member'}
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/models/new"
            >
              Add New Model
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard tabs"
            centered
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<ArticleIcon />} 
              label="My Models" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
            <Tab 
              icon={<PersonIcon />} 
              label="Profile" 
              id="tab-2" 
              aria-controls="tabpanel-2" 
            />
          </Tabs>
        </Box>
        
        {/* Dashboard Overview */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Models
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {models.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total models in the platform
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to="/"
                  >
                    View All Models
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generated Blogs
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {blogs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-generated blog posts
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="secondary"
                  >
                    View All Blogs
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Status
                  </Typography>
                  <Chip 
                    label={user?.isPremium ? 'Premium' : 'Standard'} 
                    color={user?.isPremium ? 'success' : 'primary'}
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {user?.isPremium 
                      ? 'You have access to all premium features'
                      : 'Upgrade to premium for additional features'}
                  </Typography>
                </CardContent>
                <CardActions>
                  {!user?.isPremium && (
                    <Button 
                      size="small" 
                      color="primary"
                      component={RouterLink}
                      to="/upgrade"
                    >
                      Upgrade Now
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {blogs.slice(0, 5).map((blog) => (
                  <ListItem 
                    key={blog._id}
                    component={RouterLink}
                    to={`/blogs/${blog.model}`}
                    button
                    divider
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ArticleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`Blog for ${blog.model.name || 'AI Model'}`}
                      secondary={`Generated on ${new Date(blog.lastGeneratedAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
                
                {blogs.length === 0 && (
                  <Alert severity="info">
                    No recent activity to display.
                  </Alert>
                )}
              </List>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* My Models Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/models/new"
            >
              Add New Model
            </Button>
          </Box>
          
          {models.length === 0 ? (
            <Alert severity="info">
              You haven't added any AI models yet.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {models.map((model) => (
                <Grid item key={model._id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {model.name}
                      </Typography>
                      <Chip 
                        label={model.category} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 2 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {model.description.substring(0, 100)}...
                      </Typography>
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
                        color="secondary"
                      >
                        View Blog
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        {/* Profile Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Name:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{user?.name}</Typography>
                
                <Typography variant="subtitle1">Email:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{user?.email}</Typography>
                
                <Typography variant="subtitle1">Account Type:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.isPremium ? 'Premium' : 'Standard'}
                </Typography>
                
                <Typography variant="subtitle1">Role:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {user?.role === 'expert' ? 'Expert' : 'Regular User'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Account Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                  >
                    Edit Profile
                  </Button>
                  
                  {!user?.isPremium && (
                    <Button 
                      variant="contained" 
                      color="secondary"
                      component={RouterLink}
                      to="/upgrade"
                    >
                      Upgrade to Premium
                    </Button>
                  )}
                  
                  <Button 
                    variant="outlined" 
                    color="error"
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Dashboard; 