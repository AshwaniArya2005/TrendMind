import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { db, auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PreferencePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const availableTags = [
    { id: 'text', name: 'Text Generation', category: 'Natural Language Processing' },
    { id: 'image', name: 'Image Generation', category: 'Computer Vision' },
    { id: 'chatbot', name: 'Chatbots', category: 'Conversational AI' },
    { id: 'translation', name: 'Translation', category: 'Natural Language Processing' },
    { id: 'code', name: 'Code Generation', category: 'Development' },
    { id: 'audio', name: 'Audio Generation', category: 'Audio Processing' },
    { id: 'video', name: 'Video Generation', category: 'Computer Vision' },
    { id: 'summarization', name: 'Summarization', category: 'Natural Language Processing' },
    { id: 'classification', name: 'Classification', category: 'Machine Learning' },
    { id: 'recommendation', name: 'Recommendation', category: 'Machine Learning' },
    { id: 'research', name: 'Research', category: 'Academic' },
    { id: 'healthcare', name: 'Healthcare', category: 'Industry' },
    { id: 'finance', name: 'Finance', category: 'Industry' },
    { id: 'marketing', name: 'Marketing', category: 'Industry' },
    { id: 'education', name: 'Education', category: 'Industry' },
    { id: 'gaming', name: 'Gaming', category: 'Entertainment' }
  ];

  // Check if user is coming from registration
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user already has preferences
    const fetchUserPreferences = async () => {
      try {
        setLoading(true);
        const userRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists && userDoc.data().preferences) {
          setSelectedTags(userDoc.data().preferences);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [currentUser, navigate]);

  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const savePreferences = async () => {
    if (selectedTags.length < 3) {
      setError('Please select at least 3 interests to continue');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      // Save user preferences to Firestore
      await db.collection('users').doc(currentUser.uid).set({
        preferences: selectedTags,
        email: currentUser.email,
        displayName: currentUser.displayName,
        createdAt: new Date()
      }, { merge: true });
      
      setSuccess(true);
      
      // Navigate to homepage after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      // Save minimal user data to Firestore, marking that they skipped preferences
      await db.collection('users').doc(currentUser.uid).set({
        email: currentUser.email,
        displayName: currentUser.displayName,
        preferencesSkipped: true,
        createdAt: new Date()
      }, { merge: true });
      
      // Navigate to homepage immediately
      navigate('/');
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Failed to skip. Please try again.');
      setSaving(false);
    }
  };

  // Group tags by category
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="md" sx={{ py: 8, flex: '1 0 auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            fontFamily="'Playfair Display', serif" 
            fontWeight={600} 
            gutterBottom
          >
            Customize Your Experience
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Select at least 3 topics that interest you to personalize your TrendMind experience
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Preferences saved successfully!
            </Alert>
          )}
          
          <Box sx={{ mb: 4 }}>
            {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  color="primary" 
                  fontWeight={500} 
                  sx={{ mb: 1.5 }}
                >
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {categoryTags.map(tag => (
                    <Grid item key={tag.id}>
                      <Chip
                        label={tag.name}
                        onClick={() => handleTagSelect(tag.id)}
                        color={selectedTags.includes(tag.id) ? "primary" : "default"}
                        variant={selectedTags.includes(tag.id) ? "filled" : "outlined"}
                        sx={{ 
                          m: 0.5, 
                          fontWeight: 500,
                          '&.MuiChip-colorPrimary': {
                            backgroundColor: selectedTags.includes(tag.id) ? 'primary.main' : 'transparent',
                            color: selectedTags.includes(tag.id) ? 'white' : 'text.primary',
                          },
                          '&:hover': {
                            backgroundColor: selectedTags.includes(tag.id) 
                              ? 'primary.dark' 
                              : 'rgba(0,0,0,0.08)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {selectedTags.length} topics selected {selectedTags.length < 3 && '(minimum 3)'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                disabled={saving}
                onClick={handleSkip}
                sx={{ 
                  py: 1.2, 
                  px: 4,
                  borderColor: theme => theme.palette.secondary.light,
                  color: theme => theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme => theme.palette.secondary.main,
                    backgroundColor: 'rgba(219, 112, 147, 0.05)',
                  },
                }}
              >
                Skip for Now
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={saving || selectedTags.length < 3}
                onClick={savePreferences}
                sx={{ 
                  py: 1.2, 
                  px: 4,
                  backgroundColor: theme => theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.dark,
                  },
                  color: 'white'
                }}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Preferences'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default PreferencePage; 