const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/issueController');
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new IssueController(Issue, Book, Reader);

router.post('/add', authMiddleware, controller.addIssue.bind(controller));

router.get('/all', authMiddleware, controller.getAllIssuesData.bind(controller));
router.get('/get/:issue_id', authMiddleware, controller.getIssueData.bind(controller));
router.get('/search', authMiddleware, controller.searchIssues.bind(controller));

router.patch('/edit/:issue_id', authMiddleware, controller.editIssue.bind(controller));

module.exports = router;