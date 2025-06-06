const express = require('express');
const SearchController = require('../controllers/searchController');
const BookSearchStrategy = require('../strategy/BookSearchStrategy');
const ReaderSearchStrategy = require('../strategy/ReaderSearchStrategy');
const LibrarianSearchStrategy = require('../strategy/LibrarianSearchStrategy');
const IssueSearchStrategy = require('../strategy/IssueSearchStrategy');
const router = express.Router();
const searchController = new SearchController();

router.get('/books/search', async (req, res) => {
    const query = req.query.query;
    searchController.setStrategy(new BookSearchStrategy());
    try {
        const results = await searchController.search(query);
        res.json(results);
    } catch (error) {
        console.error('Ошибка при поиске книг:', error);
        res.status(500).json({ message: 'Ошибка при выполнении поиска книг' });
    }
});

router.get('/readers/search', async (req, res) => {
    const query = req.query.query;
    searchController.setStrategy(new ReaderSearchStrategy());
    try {
        const results = await searchController.search(query);
        res.json(results);
    } catch (error) {
        console.error('Ошибка при поиске читателей:', error);
        res.status(500).json({ message: 'Ошибка при выполнении поиска читателей' });
    }
});

router.get('/librarians/search', async (req, res) => {
    const query = req.query.query;
    searchController.setStrategy(new LibrarianSearchStrategy());
    try {
        const results = await searchController.search(query);
        res.json(results);
    } catch (error) {
        console.error('Ошибка при поиске библиотекарей:', error);
        res.status(500).json({ message: 'Ошибка при выполнении поиска библиотекарей' });
    }
});

router.get('/issues/search', async (req, res) => {
    const query = req.query.query;
    searchController.setStrategy(new IssueSearchStrategy());
    try {
        const results = await searchController.search(query);
        res.json(results);
    } catch (error) {
        console.error('Ошибка при поиске выдач:', error);
        res.status(500).json({ message: 'Ошибка при выполнении поиска выдач' });
    }
});

module.exports = router;