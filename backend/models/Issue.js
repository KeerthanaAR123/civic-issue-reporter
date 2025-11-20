const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  // Main category
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Infrastructure', 'Sanitation', 'Safety', 'Environment', 'Other']
  },

  // Optional subcategory
  subCategory: {
    type: String,
    trim: true
  },

  // Location text + GeoJSON
  location: {
    address: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },

  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },

  statusHistory: [
    {
      status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved']
      },
      changedAt: {
        type: Date,
        default: Date.now
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],

  imageUrl: {
    type: String
  },

  voiceUrl: {
    type: String
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  reportedAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Geo index
issueSchema.index({ 'location.geo': '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);
