const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Model = require('../models/Model');

// Get all models with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    // Apply category filter if provided
    if (category) {
      query.category = category;
    }
    
    // Apply search filter if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    const models = await Model.find(query).sort({ createdAt: -1 });
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching models', error: error.message });
  }
});

// Get a single model by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    const model = await Model.findById(id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching model', error: error.message });
  }
});

// Create a new model
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      keyFeatures, 
      category, 
      accuracy,
      paperUrl,
      githubUrl,
      datasetUrl,
      releaseDate
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }
    
    // Create new model
    const newModel = new Model({
      name,
      description,
      keyFeatures: keyFeatures || [],
      category,
      accuracy: accuracy || null,
      paperUrl: paperUrl || null,
      githubUrl: githubUrl || null,
      datasetUrl: datasetUrl || null,
      releaseDate: releaseDate || null
    });
    
    // Save the model
    const savedModel = await newModel.save();
    
    res.status(201).json({
      message: 'Model created successfully',
      model: savedModel
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating model', error: error.message });
  }
});

// Update a model
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    const updateData = req.body;
    
    // Update the model
    const updatedModel = await Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedModel) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json({
      message: 'Model updated successfully',
      model: updatedModel
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating model', error: error.message });
  }
});

// Delete a model
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    const deletedModel = await Model.findByIdAndDelete(id);
    
    if (!deletedModel) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json({
      message: 'Model deleted successfully',
      model: deletedModel
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting model', error: error.message });
  }
});

// Get similar models
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid model ID' });
    }
    
    // Find the model
    const model = await Model.findById(id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Find similar models by category
    const similarModels = await Model.find({
      _id: { $ne: id },
      category: model.category
    }).limit(5);
    
    res.status(200).json(similarModels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching similar models', error: error.message });
  }
});

module.exports = router; 