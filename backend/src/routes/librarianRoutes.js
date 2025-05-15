const express = require('express');
const router = express.Router();
const LibrarianController = require('../controllers/librarianController');
const Librarian = require('../models/Librarian');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new LibrarianController(Librarian);

router.post('/register', controller.registerLibrarian.bind(controller));
router.post('/login', controller.loginLibrarian.bind(controller));

router.get('/librarian/:librarian_id', authMiddleware, controller.getLibrarianData.bind(controller));

router.delete('/delete-account/:librarian_id', authMiddleware, controller.deleteLibrarian.bind(controller));

router.patch('/edit-librarian/:librarian_id', authMiddleware, controller.editLibrarianData.bind(controller));

module.exports = router;