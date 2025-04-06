const mongoose = require('mongoose');

// Schema for AI models
const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  keyFeatures: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Computer Vision', 'Natural Language Processing', 'Generative AI', 
           'Reinforcement Learning', 'Audio Processing', 'Multimodal', 'Other']
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  paperUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  datasetUrl: {
    type: String,
    trim: true
  },
  releaseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for searching
ModelSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Model', ModelSchema); 