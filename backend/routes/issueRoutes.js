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

// All routes are protected
router.use(protect);

// Issue routes
router.route('/')
  .get(getAllIssues)
  .post(createIssue);

router.get('/my-issues', getMyIssues);

router.route('/:id')
  .get(getIssue)
  .put(updateIssue)
  .delete(deleteIssue);

router.patch('/:id/status', updateIssueStatus);

module.exports = router;
