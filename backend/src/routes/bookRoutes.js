const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const Book = require('../models/Book');
const Author = require('../models/Author');
const BookAuthor = require('../models/BookAuthor');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new BookController(Book, Author, BookAuthor);

router.post('/create', authMiddleware, controller.createBook.bind(controller));

module.exports = router;