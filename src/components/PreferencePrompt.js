import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import CloseIcon from '@mui/icons-material/Close';

const PreferencePrompt = () => {
  const { currentUser } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only check for users who are logged in
    if (!currentUser) {
      setShowPrompt(false);
      setLoading(false);
      return;
    }

    const checkUserPreferences = async () => {
      try {
        setLoading(true);
        const userRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
        
        // Check if user has explicitly dismissed the prompt
        if (userDoc.exists && userDoc.data().preferencePromptDismissed) {
          setShowPrompt(false);
          return;
        }
        
        // Check if user has explicitly skipped preferences
        if (userDoc.exists && userDoc.data().preferencesSkipped) {
          // Still show prompt but less frequently (e.g., only first 3 logins)
          const loginCount = userDoc.data().loginCount || 0;
          if (loginCount < 3) {
            setShowPrompt(true);
            // Update login count
            await userRef.set({
              loginCount: loginCount + 1
            }, { merge: true });
          } else {
            setShowPrompt(false);
          }
          return;
        }
        
        // Show prompt if user exists but has no preferences or has fewer than 3 preferences
        if (!userDoc.exists || 
            !userDoc.data().preferences || 
            userDoc.data().preferences.length < 3) {
          setShowPrompt(true);
        } else {
          setShowPrompt(false);
        }
      } catch (error) {
        console.error('Error checking user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserPreferences();
  }, [currentUser]);

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Remember that the user dismissed the prompt
    if (currentUser) {
      db.collection('users').doc(currentUser.uid).set({
        preferencePromptDismissed: true
      }, { merge: true });
    }
  };

  if (loading || !showPrompt) {
    return null;
  }

  return (
    <Collapse in={showPrompt}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: 'primary.light', 
          color: 'white',
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <IconButton
          size="small"
          onClick={handleDismiss}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: 'white',
            opacity: 0.8,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        
        <Box sx={{ pr: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Personalize Your Experience
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Tell us about your interests so we can recommend AI models tailored to your needs.
          </Typography>
          <Button
            component={RouterLink}
            to="/preferences"
            variant="contained"
            size="small"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.dark',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Set Preferences
          </Button>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default PreferencePrompt; 