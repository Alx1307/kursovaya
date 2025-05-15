const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/create-book', bookController.createBook);

module.exports = router;