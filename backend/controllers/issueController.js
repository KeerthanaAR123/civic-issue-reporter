const Issue = require('../models/Issue');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('reportedBy', 'email').sort({ reportedAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get issues by user
// @route   GET /api/issues/my-issues
// @access  Private
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id }).sort({ reportedAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('reportedBy', 'email');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      priority,
      reportedBy: req.user.id
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user owns the issue
    if (issue.reportedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this issue' });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update issue status
// @route   PATCH /api/issues/:id/status
// @access  Private
const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = status;
    
    // Set resolvedAt date if status is Resolved
    if (status === 'Resolved') {
      issue.resolvedAt = Date.now();
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user owns the issue
    if (issue.reportedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this issue' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllIssues,
  getMyIssues,
  getIssue,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue
};
