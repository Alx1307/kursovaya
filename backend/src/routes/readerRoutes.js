const express = require('express');
const router = express.Router();
const ReaderController = require('../controllers/readerController');
const Reader = require('../models/Reader');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new ReaderController(Reader);

router.post('/add', authMiddleware, controller.addReader.bind(controller));

router.get('/get/:reader_id', authMiddleware, controller.getReaderData.bind(controller));
router.get('/all', authMiddleware, controller.getAllReaders.bind(controller));
router.get('/:reader_id/issues', authMiddleware, controller.getIssuesForReader.bind(controller));

router.patch('/edit/:reader_id', authMiddleware, controller.editReader.bind(controller));

router.delete('/delete/:reader_id', authMiddleware, controller.deleteReader.bind(controller));

module.exports = router;