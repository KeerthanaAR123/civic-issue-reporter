const mongoose = require('mongoose');
const IssueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Links issue to a specific user
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'Reported', enum: ['Reported', 'In Progress', 'Resolved'] },
  imageUrl: { type: String },
  adminResponse: { type: String, default: null }, // Admin's response to the issue
  responseDate: { type: Date, default: null }, // When admin responded
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Issue', IssueSchema);

