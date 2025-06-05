const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticController');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new StatisticsController();

router.get('/total/books', authMiddleware, controller.getTotalBooks.bind(controller));
router.get('/total/readers', authMiddleware, controller.getTotalReaders.bind(controller));
router.get('/total/librarians', authMiddleware, controller.getTotalLibrarians.bind(controller));
router.get('/total/halls', authMiddleware, controller.getTotalHalls.bind(controller));
router.get('/total/issues', authMiddleware, controller.getTotalIssues.bind(controller));
router.get('/popular/book', authMiddleware, controller.getMostPopularBook.bind(controller));
router.get('/popular/reader', authMiddleware, controller.getMostPopularReader.bind(controller));
router.get('/hall/mostreaders', authMiddleware, controller.getHallWithMostReaders.bind(controller));
router.get('/admins', authMiddleware, controller.getAllAdmins.bind(controller));
router.get('/expired/issues', authMiddleware, controller.getExpiredIssues.bind(controller));

module.exports = router;