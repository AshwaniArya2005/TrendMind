const mongoose = require('mongoose');

// Schema for AI model blogs
const BlogSchema = new mongoose.Schema({
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    default: null
  },
  version: {
    type: Number,
    default: 1
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  reviewsIncluded: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  lastGeneratedAt: {
    type: Date,
    default: Date.now
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

module.exports = mongoose.model('Blog', BlogSchema); 