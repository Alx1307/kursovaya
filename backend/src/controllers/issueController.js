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
            
            const book = await Book.findByPk(book_id);
            if (!book) {
                return res.status(404).send('Книга не найдена.');
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
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещён.');
            }
    
            const { issue_id } = req.params;
    
            if (!issue_id) {
                return res.status(400).send('Некорректный id.');
            }
    
            const issue = await this.Issue.findByPk(issue_id, {
                attributes: ['issue_id', 'book_id', 'reader_id'],
            });
    
            if (!issue) {
                return res.status(404).send('Нет такой выдачи');
            }
    
            const book = await this.Book.findByPk(issue.book_id, {
                attributes: ['code']
            });
    
            const reader = await this.Reader.findByPk(issue.reader_id, {
                attributes: ['card_number']
            });
    
            const issueData = {
                ...issue.toJSON(),
                BookCode: book.code,
                ReaderCardNumber: reader.card_number
            };
    
            return res.status(200).json(issueData);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = IssueController;