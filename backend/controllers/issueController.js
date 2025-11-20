const Issue = require('../models/Issue');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private (admin/officer depending on your middleware)
const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reportedBy', 'email')
      .populate('assignedTo', 'email')
      .populate('department', 'name')
      .sort({ reportedAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error('Error in getAllIssues:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get issues by logged-in user
// @route   GET /api/issues/my-issues
// @access  Private (citizen)
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user.id }).sort({ reportedAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error('Error in getMyIssues:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'email')
      .populate('assignedTo', 'email')
      .populate('department', 'name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Error in getIssue:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private (citizen)
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      locationAddress,
      latitude,
      longitude,
      priority,
      departmentId
    } = req.body;

    if (!title || !description || !category || !locationAddress || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle optional files if you use multer.fields([{ name: 'image' }, { name: 'voice' }])
    let imageUrl = null;
    let voiceUrl = null;

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        imageUrl = req.files.image[0].path || req.files.image[0].location || null;
      }
      if (req.files.voice && req.files.voice[0]) {
        voiceUrl = req.files.voice[0].path || req.files.voice[0].location || null;
      }
    } else if (req.file) {
      // If currently using single('image')
      imageUrl = req.file.path || req.file.location || null;
    }

    // Build GeoJSON if we have coordinates
    let geo = undefined;
    if (latitude && longitude) {
      const latNum = Number(latitude);
      const lngNum = Number(longitude);
      if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
        geo = {
          type: 'Point',
          coordinates: [lngNum, latNum]
        };
      }
    }

    const initialStatus = 'Pending';

    const issue = await Issue.create({
      title,
      description,
      category,
      subCategory: subCategory || undefined,
      location: {
        address: locationAddress,
        geo
      },
      priority,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          changedBy: req.user.id
        }
      ],
      imageUrl,
      voiceUrl,
      reportedBy: req.user.id,
      department: departmentId || undefined
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error('Error in createIssue:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update issue (only owner can update core fields)
// @route   PUT /api/issues/:id
// @access  Private (citizen)
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

    const {
      title,
      description,
      category,
      subCategory,
      locationAddress,
      latitude,
      longitude,
      priority
    } = req.body;

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (category !== undefined) issue.category = category;
    if (subCategory !== undefined) issue.subCategory = subCategory;
    if (priority !== undefined) issue.priority = priority;

    if (locationAddress || latitude || longitude) {
      const loc = issue.location || {};
      loc.address = locationAddress || loc.address;

      if (latitude && longitude) {
        const latNum = Number(latitude);
        const lngNum = Number(longitude);
        if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
          loc.geo = {
            type: 'Point',
            coordinates: [lngNum, latNum]
          };
        }
      }

      issue.location = loc;
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    console.error('Error in updateIssue:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update issue status (officer/admin)
// @route   PATCH /api/issues/:id/status
// @access  Private (officer/admin)
const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = status;

    // Push into status history
    issue.statusHistory.push({
      status,
      changedBy: req.user.id
    });

    // Set resolvedAt date if status is Resolved
    if (status === 'Resolved') {
      issue.resolvedAt = Date.now();
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    console.error('Error in updateIssueStatus:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete issue (only owner)
// @route   DELETE /api/issues/:id
// @access  Private (citizen)
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
    console.error('Error in deleteIssue:', error);
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
