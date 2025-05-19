const database = require('../config/database');
const sequelize = database.sequelize;
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const Author = require('../models/Author');
const BookAuthor = require('../models/BookAuthor');
const { json } = require('sequelize');

class BookController {
    constructor(BookModel, AuthorModel, BookAuthorModel) {
        this.Book = BookModel;
        this.Author = AuthorModel;
        this.BookAuthor = BookAuthorModel;
    }

    async createBook(req, res) {
        try {
            if (req.userData.role !== 'Библиограф') {
                return res.status(403).send('Доступ запрещен.');
            }

            const { title, publish_year, isbn, code, date_added, quantity, authors } = req.body;

            if (!title) return res.status(400).send("Название книги обязательно.");
            if (!isbn) return res.status(400).send("ISBN книги обязателен.");
            if (!code) return res.status(400).send("Шифр книги обязателен.");
        
            let newBook = await this.Book.create({
                title,
                publish_year,
                isbn,
                code,
                date_added,
                quantity
            });

            if (authors && Array.isArray(authors)) {
                for (let i = 0; i < authors.length; i++) {
                    const currentAuthor = authors[i];

                    if (!currentAuthor.surname || !currentAuthor.name) {
                        continue;
                    }

                    let searchParams = { surname: currentAuthor.surname, name: currentAuthor.name };

                    if (currentAuthor.patronymic) {
                        searchParams.patronymic = currentAuthor.patronymic;
                    }

                    let existingAuthor = await this.Author.findOne({ where: searchParams });

                    if (existingAuthor) {
                        const authorId = existingAuthor.author_id;
                        const bookId = newBook.book_id;
                        await this.BookAuthor.create({ book_id: bookId, author_id: authorId });
                    } else {
                        const newAuthor = await this.Author.create(currentAuthor);
                       
                        const authorId = newAuthor.author_id;
                        const bookId = newBook.book_id;
                        await this.BookAuthor.create({ book_id: bookId, author_id: authorId });
                    }
                }
            }
       
            res.status(201).send('Книга успешно добавлена.');
        } catch(err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async getBookData(req, res) {
        try {
            const { book_id } = req.params;
            
            const book = await this.Book.findByPk(book_id);

            if (!book) {
                return res.status.send('Книга не найдена.');
            }

            const bookAuthorRecords = await this.BookAuthor.findAll({
                where: { book_id: book_id },
                attributes: ['author_id']
            });

            const authorIds = bookAuthorRecords.map(record => record.author_id);

            const authors = await this.Author.findAll({
                where: { author_id: authorIds }
            });

            const result = {
                ...book.toJSON(),
                Authors: authors.map(author => ({
                    author_id: author.author_id,
                    surname: author.surname,
                    name: author.name,
                    patronymic: author.patronymic
                }))
            };

            return res.json(result);
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async getAllBooksData(res) {
        try {
            const books = await this.Book.findAll();

            const result = [];

            for (const book of books) {
                const bookAuthors = await this.BookAuthor.findAll({
                    where: { book_id: book.book_id },
                    attributes: ['author_id']
                });

                const authorIds = bookAuthors.map(author => author.author_id);

                const authors = await this.Author.findAll({
                    where: { author_id: authorIds }
                });

                const bookInfo = {
                    ...book.toJSON(),
                    Authors: authors.map(author => ({
                        author_id: author.author_id,
                        surname: author.surname,
                        name: author.name,
                        patronymic: author.patronymic
                    }))
                };

                result.push(bookInfo);
            }

            return res.json(result);
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async editBook(req, res) {
        try {
            if (req.userData.role !== 'Библиограф') {
                return res.status(403).send('Доступ запрещен.');
            }
    
            const { book_id } = req.params;
            const { title, publish_year, isbn, code, quantity, authors } = req.body;
    
            const book = await this.Book.findByPk(book_id);
            if (!book) {
                return res.status(404).send('Книга не найдена.');
            }
    
            await book.update({
                title,
                publish_year,
                isbn,
                code,
                quantity
            });
    
            if (authors && Array.isArray(authors)) {
                await this.BookAuthor.destroy({ where: { book_id: book_id } });
    
                for (let i = 0; i < authors.length; i++) {
                    const currentAuthor = authors[i];
                    
                    if (!currentAuthor.surname || !currentAuthor.name) {
                        continue;
                    }
    
                    let searchParams = { surname: currentAuthor.surname, name: currentAuthor.name };
                    if (currentAuthor.patronymic) {
                        searchParams.patronymic = currentAuthor.patronymic;
                    }
    
                    let existingAuthor = await this.Author.findOne({ where: searchParams });
    
                    if (existingAuthor) {
                        await this.BookAuthor.create({ book_id: book_id, author_id: existingAuthor.author_id });
                    } else {
                        const newAuthor = await this.Author.create(currentAuthor);
                        await this.BookAuthor.create({ book_id: book_id, author_id: newAuthor.author_id });
                    }
                }
            }
    
            res.status(200).send('Книга успешно обновлена.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
}

module.exports = BookController;