const Sequelize = require('sequelize');
const { Op } = Sequelize;

const database = require('../config/database');
const sequelize = database.sequelize;
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Reader = require('../models/Reader');

class IssueController {
    constructor(IssueModel, BookModel, ReaderModel) {
        this.Issue = IssueModel,
        this.Book = BookModel,
        this.Reader = ReaderModel
    }

    async addIssue(req, res) {
        try {
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещен.');
            }

            const { book_id, reader_id, return_date, comment } = req.body;

            if (!book_id || !reader_id || !return_date) {
                return res.status(400).json({
                    error: true,
                    message: 'Необходимо заполнить поля: Id книги, Id читателя и срок возврата.'
                });
            }
            
            const book = await Book.findByPk(book_id, {
                attributes: ['quantity']
            });

            if (!book) {
                return res.status(404).send('Книга не найдена.');
            }

            const issuedCount = await this.Issue.count({
                where:{
                    book_id,
                    status:  { [Op.or]: ['Выдана', 'Просрочена'] }  
                }
            });

            if ((book.quantity - issuedCount) <= 0) {
                return res.status(400).send('Все доступные экземпляры книги уже выданы.');
            }

            const reader = await Reader.findByPk(reader_id);

            if (!reader) {
                return res.status(404).send('Читатель не найден.');
            }

            const currentDate = new Date().toISOString();
            await this.Issue.create({
                book_id,
                reader_id,
                issue_date: currentDate,
                return_date,
                status: 'Выдана',
                comment
            });
    
            return res.status(201).send('Книга успешно выдана.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getIssueData(req, res) {
        try {    
            const { issue_id } = req.params;
    
            if (!issue_id) {
                return res.status(400).send('Некорректный id.');
            }
    
            const issue = await this.Issue.findByPk(issue_id, {
                attributes: ['issue_id', 'book_id', 'reader_id', 'issue_date', 'return_date', 'status', 'comment'],
            });
    
            if (!issue) {
                return res.status(404).send('Нет такой выдачи');
            }

            const today = new Date();
            const returnDate = new Date(issue.return_date);

            if (today > returnDate && issue.status === 'Выдана') {
                await issue.update({ status: 'Просрочена' });
            }
    
            const book = await this.Book.findByPk(issue.book_id, {
                attributes: ['code']
            });
    
            const reader = await this.Reader.findByPk(issue.reader_id, {
                attributes: ['card_number']
            });

            const formattedIssueDate = new Date(issue.issue_date).toLocaleDateString('ru-RU');
            const formattedReturnDate = new Date(issue.return_date).toLocaleDateString('ru-RU');
    
            const issueData = {
                ...issue.toJSON(),
                book_code: book.code,
                reader_card_number: reader.card_number,
                issue_date: formattedIssueDate,
                return_date: formattedReturnDate
            };
    
            return res.status(200).json(issueData);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getAllIssuesData(req, res) {
        try {
            const issues = await this.Issue.findAll({
                attributes: ['issue_id', 'book_id', 'reader_id', 'issue_date', 'return_date', 'status', 'comment'],
            });
    
            if (!issues.length) {
                return res.status(200).json([]);
            }
    
            let results = [];
    
            for (let i = 0; i < issues.length; i++) {
                const issue = issues[i];

                const today = new Date();
                const returnDate = new Date(issue.return_date);

                if (today > returnDate && issue.status === 'Выдана') {
                    await issue.update({ status: 'Просрочена' });
                }
    
                const book = await this.Book.findByPk(issue.book_id, {
                    attributes: ['code']
                });
    
                const reader = await this.Reader.findByPk(issue.reader_id, {
                    attributes: ['card_number']
                });

                const formattedIssueDate = new Date(issue.issue_date).toLocaleDateString('ru-RU');
                const formattedReturnDate = new Date(issue.return_date).toLocaleDateString('ru-RU');
    
                const issueData = {
                    ...issue.toJSON(),
                    book_code: book ? book.code : null,
                    reader_card_number: reader ? reader.card_number : null,
                    issue_date: formattedIssueDate,
                    return_date: formattedReturnDate
                };
    
                results.push(issueData);
            }
    
            return res.status(200).json(results);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async editIssue(req, res) {
        try {
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещён.');
            }
    
            const { issue_id } = req.params;
            const { book_id, reader_id, return_date, status, comment } = req.body;
    
            if (!issue_id) {
                return res.status(400).send('Некорректный идентификатор выдачи.');
            }
    
            const existingIssue = await this.Issue.findByPk(issue_id);
    
            if (!existingIssue) {
                return res.status(404).send('Выдача не найдена.');
            }
    
            if (book_id && !(await Book.findByPk(book_id))) {
                return res.status(404).send('Указанная книга не найдена.');
            }
    
            if (reader_id && !(await Reader.findByPk(reader_id))) {
                return res.status(404).send('Указанный читатель не найден.');
            }
    
            await existingIssue.update({
                book_id: book_id || existingIssue.book_id,
                reader_id: reader_id || existingIssue.reader_id,
                return_date: return_date || existingIssue.return_date,
                status: status || existingIssue.status,
                comment: comment || existingIssue.comment
            });
    
            return res.status(200).send('Выдача успешно обновлена.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = IssueController;