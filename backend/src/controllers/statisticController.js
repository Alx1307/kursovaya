const database = require('../config/database');
const sequelize = database.sequelize;
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const Librarian = require('../models/Librarian');
const Hall = require('../models/Hall');
const Issue = require('../models/Issue');

class StatisticsController {
    async getTotalBooks(req, res) {
        try {
            const totalBooks = await Book.count();
            return res.status(200).json({ totalBooks });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
    async getTotalReaders(req, res) {
        try {
            const totalReaders = await Reader.count();
            return res.status(200).json({ totalReaders });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getTotalLibrarians(req, res) {
        try {
            const totalLibrarians = await Librarian.count();
            return res.status(200).json({ totalLibrarians });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
    async getTotalHalls(req, res) {
        try {
            const totalHalls = await Hall.count();
            return res.status(200).json({ totalHalls });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getTotalIssues(req, res) {
        try {
            const totalIssues = await Issue.count();
            return res.status(200).json({ totalIssues });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getMostPopularBook(req, res) {
        try {
            const popularBook = await Issue.findOne({
                attributes: ['book_id', [sequelize.fn('COUNT', sequelize.col('book_id')), 'count']],
                group: ['book_id'],
                order: [[sequelize.fn('COUNT', sequelize.col('book_id')), 'DESC']],
                limit: 1,
            });
            if (!popularBook) {
                return res.status(404).send('Нет данных о выдачах книг.');
            }
            const book = await Book.findByPk(popularBook.book_id);
            return res.status(200).json({ book: book.title, count: popularBook.count });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getMostPopularReader(req, res) {
        try {
            const popularReader = await Issue.findOne({
                attributes: ['reader_id', [sequelize.fn('COUNT', sequelize.col('reader_id')), 'count']],
                group: ['reader_id'],
                order: [[sequelize.fn('COUNT', sequelize.col('reader_id')), 'DESC']],
                limit: 1,
            });
            if (!popularReader) {
                return res.status(404).send('Нет данных о выдачах читателей.');
            }
            const reader = await Reader.findByPk(popularReader.reader_id);
            return res.status(200).json({ reader: reader.name, count: popularReader.count });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getHallWithMostReaders(req, res) {
        try {
            const hallWithMostReaders = await Reader.findOne({
                attributes: ['hall_id', [sequelize.fn('COUNT', sequelize.col('hall_id')), 'count']],
                group: ['hall_id'],
                order: [[sequelize.fn('COUNT', sequelize.col('hall_id')), 'DESC']],
                limit: 1,
            });
            if (!hallWithMostReaders) {
                return res.status(404).send('Нет данных о читателях в залах.');
            }
            const hall = await Hall.findByPk(hallWithMostReaders.hall_id);
            return res.status(200).json({ hall: hall.number, count: hallWithMostReaders.count });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getAllAdmins(req, res) {
        try {
            const admins = await Librarian.findAll({
                where: { role: 'Администратор' },
                attributes: ['librarian_id', 'full_name', 'email'],
            });
            return res.status(200).json(admins);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getExpiredIssues(req, res) {
        try {
            const expiredIssues = await Issue.findAll({
                where: { status: 'Просрочена' },
                attributes: ['issue_id', 'book_id', 'reader_id', 'issue_date', 'return_date', 'status'],
            });
            
            const formattedIssues = expiredIssues.map(issue => {
                return {
                    ...issue.dataValues,
                    issue_date: new Date(issue.issue_date).toLocaleDateString('ru-RU'),
                    return_date: new Date(issue.return_date).toLocaleDateString('ru-RU'),
                };
            });

            return res.status(200).json(formattedIssues);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = StatisticsController;