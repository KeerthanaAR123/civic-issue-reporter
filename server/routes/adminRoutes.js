const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin'); 

// GET ALL ISSUES (Admin View) with filtering
router.get('/issues', auth, isAdmin, async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    const issues = await Issue.find(query).populate('user', 'name email').sort({ date: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET STATISTICS
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const stats = {
      total: await Issue.countDocuments(),
      reported: await Issue.countDocuments({ status: 'Reported' }),
      inProgress: await Issue.countDocuments({ status: 'In Progress' }),
      resolved: await Issue.countDocuments({ status: 'Resolved' })
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ISSUES BY CATEGORY
router.get('/category/:category', auth, isAdmin, async (req, res) => {
  try {
    const issues = await Issue.find({ category: req.params.category }).populate('user', 'name email').sort({ date: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STATUS
router.patch('/issues/:id/status', auth, isAdmin, async (req, res) => {
  const { status } = req.body; 
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
    );
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADD ADMIN RESPONSE TO ISSUE
router.patch('/issues/:id/response', auth, isAdmin, async (req, res) => {
  const { adminResponse } = req.body;
  try {
    if (!adminResponse || adminResponse.trim() === '') {
      return res.status(400).json({ message: 'Response cannot be empty' });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { 
        adminResponse: adminResponse,
        responseDate: new Date()
      },
      { new: true }
    ).populate('user', 'name email');

    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ISSUE
router.delete('/issues/:id', auth, isAdmin, async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
