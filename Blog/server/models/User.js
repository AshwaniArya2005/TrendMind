const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for users
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'expert', 'admin'],
    default: 'user'
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['Computer Vision', 'Natural Language Processing', 'Generative AI', 
             'Reinforcement Learning', 'Audio Processing', 'Multimodal', 'Other']
    }],
    notificationEnabled: {
      type: Boolean,
      default: true
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: null
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

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema); 