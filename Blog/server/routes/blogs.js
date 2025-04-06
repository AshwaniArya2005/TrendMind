const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { generateBlog } = require('../services/blogGenerator');
const { convertToSpeech } = require('../services/textToSpeech');
const Blog = require('../models/Blog');
const Model = require('../models/Model');
const Review = require('../models/Review');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate('model', 'name description category')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Get a single blog by model ID
router.get('/model/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    const blog = await Blog.findOne({ 
      model: modelId,
      isPublished: true 
    }).populate('model');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Generate blog for a model
router.post('/generate/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    // Find the model
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Get reviews for the model
    const reviews = await Review.find({ model: modelId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Format reviews for the blog generator
    const formattedReviews = reviews.map(review => ({
      user: review.user.name,
      rating: review.rating,
      comment: review.comment,
      isExpert: review.isExpert
    }));
    
    // Prepare model info for blog generation
    const modelInfo = {
      name: model.name,
      description: model.description,
      paperUrl: model.paperUrl || 'Not available',
      githubUrl: model.githubUrl || 'Not available',
      keyFeatures: model.keyFeatures || [],
      userReviews: formattedReviews
    };
    
    // Generate blog content
    const blogContent = await generateBlog(modelInfo);
    
    // Check if a blog already exists for this model
    let blog = await Blog.findOne({ model: modelId });
    
    if (blog) {
      // Update existing blog
      blog.content = blogContent;
      blog.version += 1;
      blog.reviewsIncluded = reviews.map(review => review._id);
      blog.lastGeneratedAt = Date.now();
      blog.audioUrl = null; // Reset audio URL as we'll generate new audio
    } else {
      // Create new blog
      blog = new Blog({
        model: modelId,
        content: blogContent,
        reviewsIncluded: reviews.map(review => review._id)
      });
    }
    
    // Save the blog
    await blog.save();
    
    // Generate audio for the blog (in background, don't wait for it)
    convertToSpeech(blogContent, modelId)
      .then(audioUrl => {
        // Update the blog with the audio URL
        Blog.findByIdAndUpdate(blog._id, { audioUrl })
          .catch(error => console.error('Error updating blog with audio URL:', error));
      })
      .catch(error => console.error('Error generating audio:', error));
    
    res.status(200).json({
      message: 'Blog generated successfully',
      blog
    });
  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({ message: 'Error generating blog', error: error.message });
  }
});

// Regenerate audio for a blog
router.post('/:blogId/regenerate-audio', async (req, res) => {
  try {
    const { blogId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    
    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Generate audio
    const audioUrl = await convertToSpeech(blog.content, blog.model);
    
    // Update blog with new audio URL
    blog.audioUrl = audioUrl;
    await blog.save();
    
    res.status(200).json({
      message: 'Audio regenerated successfully',
      audioUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating audio', error: error.message });
  }
});

module.exports = router; 