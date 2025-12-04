const express = require('express');
const router = express.Router();
const { createIssue, getIssues } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Route: GET /api/issues (Public or Protected based on your need)
router.get('/', getIssues);

// Route: POST /api/issues (Protected + Image Upload)
// 'image' is the key name the frontend must use when sending the file
router.post('/', protect, upload.single('image'), createIssue);

module.exports = router;