const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarianController');

router.post('/register', librarianController.registerLibrarian);
router.post('/login', librarianController.loginLibrarian);

module.exports = router;