const express = require('express');
const router = express.Router();

const {
  getAllIssues,
  getMyIssues,
  getIssue,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue
} = require('../controllers/issueController');

const { protect } = require('../middleware/auth');
// If/when you add Multer upload for image + voice, you will import it here:
// const upload = require('../middleware/upload'); // example path

// ---------------------------------------------------------------------------
// All routes below require authentication
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// @route   GET /api/issues
// @desc    Get all issues (admin/officer depending on your role logic)
// @access  Private
// ---------------------------------------------------------------------------
router
  .route('/')
  .get(getAllIssues)
  // For now, createIssue without files.
  // Later, when you add Multer for image+voice, change this to:
  // .post(
  //   upload.fields([
  //     { name: 'image', maxCount: 1 },
  //     { name: 'voice', maxCount: 1 }
  //   ]),
  //   createIssue
  // );
  .post(createIssue);

// ---------------------------------------------------------------------------
// @route   GET /api/issues/my-issues
// @desc    Get issues reported by the logged-in user
// @access  Private
// ---------------------------------------------------------------------------
router.get('/my-issues', getMyIssues);

// ---------------------------------------------------------------------------
// @route   GET /api/issues/:id
// @desc    Get a single issue
// @route   PUT /api/issues/:id
// @desc    Update issue (citizen-owned fields)
// @route   DELETE /api/issues/:id
// @desc    Delete issue (if owner)
// @access  Private
// ---------------------------------------------------------------------------
router
  .route('/:id')
  .get(getIssue)
  .put(updateIssue)
  .delete(deleteIssue);

// ---------------------------------------------------------------------------
// @route   PATCH /api/issues/:id/status
// @desc    Update issue status (officer/admin)
// @access  Private
// ---------------------------------------------------------------------------
router.patch('/:id/status', updateIssueStatus);

module.exports = router;
