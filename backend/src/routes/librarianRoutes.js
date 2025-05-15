const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarianController');

router.post('/register', librarianController.registerLibrarian);
router.post('/login', librarianController.loginLibrarian);

router.get('/librarian/:librarian_id', librarianController.getLibrarianData);

router.delete('/delete-account/:librarian_id', librarianController.deleteLibrarian);

router.patch('/edit-librarian/:librarian_id', librarianController.editLibrarianData);

module.exports = router;