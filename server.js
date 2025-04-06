const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// Remove MongoDB connection import

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Remove MongoDB connection code

// Import mock data
const mockModels = require('./src/data/mockModels.js');

// API Routes

// Get models with filtering, sorting, and pagination
app.get('/api/models', async (req, res) => {
  try {
    const { 
      limit = 20, 
      sort = 'trending', 
      filter = '', 
      page = 1 
    } = req.query;
    
    // Use mock data instead of MongoDB
    let filteredModels = [...mockModels];
    
    // Add tag filter if provided
    if (filter) {
      filteredModels = filteredModels.filter(model => 
        model.tags && model.tags.includes(filter)
      );
    }
    
    // Determine sort field and direction
    switch(sort) {
      case 'downloads':
        filteredModels.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'likes':
        filteredModels.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        // Best approximation of trending
        filteredModels.sort((a, b) => {
          // First by likes
          if (b.likes !== a.likes) return b.likes - a.likes;
          // Then by downloads
          if (b.downloadCount !== a.downloadCount) return b.downloadCount - a.downloadCount;
          // Finally by update date
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        });
        break;
      case 'modified':
      case 'recent':
        filteredModels.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      default:
        filteredModels.sort((a, b) => b.likes - a.likes);
    }
    
    // Calculate pagination
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    const total = filteredModels.length;
    
    // Get paginated results
    const paginatedModels = filteredModels.slice(skip, skip + limitInt);
    
    res.json({
      models: paginatedModels,
      pagination: {
        total,
        page: pageInt,
        limit: limitInt,
        pages: Math.ceil(total / limitInt)
      }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single model by ID
app.get('/api/models/:id', async (req, res) => {
  try {
    const model = mockModels.find(model => model.id === req.params.id);
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    res.json(model);
  } catch (error) {
    console.error(`Error fetching model ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch multiple models by IDs (for favorites)
app.post('/api/models/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid request. IDs array required.' });
    }
    
    const models = mockModels.filter(model => ids.includes(model.id));
    
    res.json(models);
  } catch (error) {
    console.error('Error fetching batch models:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search models by text
app.get('/api/models/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;
    
    const searchResults = mockModels.filter(model => {
      const searchableText = `${model.name} ${model.description}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    }).slice(0, parseInt(limit));
    
    res.json(searchResults);
  } catch (error) {
    console.error(`Error searching models for "${req.params.query}":`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 