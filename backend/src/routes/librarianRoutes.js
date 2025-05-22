const express = require('express');
const router = express.Router();
const LibrarianController = require('../controllers/librarianController');
const Librarian = require('../models/Librarian');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new LibrarianController(Librarian);

router.post('/register', controller.registerLibrarian.bind(controller));
router.post('/login', controller.loginLibrarian.bind(controller));

router.get('/librarian/get/:librarian_id', authMiddleware, controller.getLibrarianData.bind(controller));
router.get('/librarian/all', authMiddleware, controller.getAllLibrariansData.bind(controller));
router.get('/librarian/data', authMiddleware, controller.getLibrarianTokenData.bind(controller));

router.delete('/librarian/delete/:librarian_id', authMiddleware, controller.deleteLibrarian.bind(controller));

router.patch('/librarian/edit/:librarian_id', authMiddleware, controller.editLibrarianData.bind(controller));

module.exports = router;