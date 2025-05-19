const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const Book = require('../models/Book');
const Author = require('../models/Author');
const BookAuthor = require('../models/BookAuthor');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new BookController(Book, Author, BookAuthor);

router.post('/create', authMiddleware, controller.createBook.bind(controller));

router.get('/all', authMiddleware, controller.getAllBooksData.bind(controller));
router.get('/get/:book_id', authMiddleware, controller.getBookData.bind(controller));

router.patch('/edit/:book_id', authMiddleware, controller.editBook.bind(controller));

router.delete('/delete/:book_id', authMiddleware, controller.deleteBook.bind(controller));

module.exports = router;