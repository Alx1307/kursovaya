const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/issueController');
const Issue = require('../models/Issue');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new IssueController(Issue);

router.post('/add', authMiddleware, controller.addIssue.bind(controller));

module.exports = router;