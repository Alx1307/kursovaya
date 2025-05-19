const express = require('express');
const router = express.Router();
const ReaderController = require('../controllers/readerController');
const Reader = require('../models/Reader');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new ReaderController(Reader);

router.post('/add', authMiddleware, controller.addReader.bind(controller));

module.exports = router;