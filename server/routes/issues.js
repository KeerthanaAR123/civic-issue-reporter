const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Issue = require('../models/Issue');
const { storage } = require('../config/cloudinary'); // Use Cloudinary Storage
const { issueSchema } = require('../utils/validation'); // Use Zod Validation
const upload = multer({ storage }); 

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// GET ISSUES - Citizens see their own, Admins see all
router.get('/', auth, async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};

    if (req.user.role === 'admin') {
      // Admin sees all issues
      if (category) query.category = category;
      if (status) query.status = status;
      const issues = await Issue.find(query).populate('user', 'name email').sort({ date: -1 });
      res.json(issues);
    } else {
      // Citizens see only their issues
      query.user = req.user.id;
      if (category) query.category = category;
      if (status) query.status = status;
      const issues = await Issue.find(query).sort({ date: -1 });
      res.json(issues);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET SINGLE ISSUE
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('user', 'name email');
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    
    // Check if user owns this issue or is admin
    if (req.user.role !== 'admin' && issue.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// CREATE ISSUE (With Cloudinary Upload)
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    // Validate text data with Zod
    const validation = issueSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const newIssue = new Issue({
      user: req.user.id,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      address: req.body.address,
      status: 'Reported',
      // Cloudinary returns the secure URL in req.file.path
      imageUrl: req.file ? req.file.path : null 
    });

    const issue = await newIssue.save();
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// UPDATE STATUS (Admin Only)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  try {
    let issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    issue.status = req.body.status;
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE ISSUE - Users can delete their own, Admins can delete any
router.delete('/:id', auth, async (req, res) => {
  try {
    let issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    
    // Allow if Admin OR if User owns the issue
    if (req.user.role !== 'admin' && issue.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await issue.deleteOne();
    res.json({ msg: 'Issue removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
