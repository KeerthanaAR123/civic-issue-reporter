const Issue = require('../models/Issue');
const cloudinary = require('../config/cloudinary');
const { issueSchema } = require('../utils/validation');
const fs = require('fs');

// @desc    Report a new issue
// @route   POST /api/issues
exports.createIssue = async (req, res) => {
  try {
    // 1. Zod Validation (req.body parsing)
    // Note: When using FormData (for images), numbers often come as strings
    const { title, description, category, address, latitude, longitude } = req.body;
    
    // Manual validation check or Zod parsing here...
    if(!title || !description || !address) {
       return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Image Upload to Cloudinary
    let imageUrl = '';
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'civic-reporter',
        });
        imageUrl = result.secure_url;
        
        // Remove file from local uploads folder after success
        fs.unlinkSync(req.file.path); 
      } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    // 3. Save to DB
    const issue = await Issue.create({
      title,
      description,
      category,
      location: {
        address,
        coordinates: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)] 
        }
      },
      imageUrl,
      createdBy: req.user.id
    });

    res.status(201).json(issue);

  } catch (error) {
    // Cleanup file if DB save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};