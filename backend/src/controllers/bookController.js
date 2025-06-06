const Sequelize = require('sequelize');
const { Op } = Sequelize;

const database = require('../config/database');
const sequelize = database.sequelize;
const Book = require('../models/Book');
const Author = require('../models/Author');
const BookAuthor = require('../models/BookAuthor');
const Issue = require('../models/Issue');

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
            const { title, publish_year, isbn, code, quantity, authors } = req.body;
            if (!title) return res.status(400).send("Название книги обязательно.");
            if (!isbn) return res.status(400).send("ISBN книги обязателен.");
            if (!code) return res.status(400).send("Шифр книги обязателен.");
            let newBook = await this.Book.create({
                title,
                publish_year,
                isbn,
                code,
                date_added: new Date(),
                quantity
            });

            if (authors && Array.isArray(authors)) {
                for (const currentAuthor of authors) {
                    if (!currentAuthor.name) {
                        continue;
                    }
                    const authorId = await this.createOrFindAuthor(currentAuthor);
                    await this.BookAuthor.create({ book_id: newBook.book_id, author_id: authorId });
                }
            }
            res.status(201).send('Книга успешно добавлена.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async getBookData(req, res) {
        try {
            const { book_id } = req.params;
            
            const book = await this.Book.findByPk(book_id);

            if (!book) {
                return res.status(404).send('Книга не найдена.');
            }

            const bookAuthorRecords = await this.BookAuthor.findAll({
                where: { book_id: book_id },
                attributes: ['author_id']
            });

            const authorIds = bookAuthorRecords.map(record => record.author_id);

            const authors = await this.Author.findAll({
                where: { author_id: authorIds },
                attributes: ['surname', 'name', 'patronymic'],
            }); 

            let allAuthors;

            if (authors.length > 0) {
                allAuthors = authors.map((author) => {
                    let fullName = `${author.surname} ${author.name}`;
                    if (author.patronymic && author.patronymic.trim()) {
                        fullName += ` ${author.patronymic}`;
                    }
                    return fullName;
                }).join(', ');
            } else {
                allAuthors = '-';
            }

            const issuedCount = await Issue.count({
                where: {
                    book_id: book.book_id,
                    status: { [Op.or]: ['Выдана', 'Просрочена'] },
                },
            });

            const availableQuantity = book.quantity - issuedCount;

            const result = {
                ...book.toJSON(),
                authorsArray: authors.map((author) => ({
                    surname: author.surname,
                    name: author.name,
                    patronymic: author.patronymic
                })),
                authors: allAuthors,
                available_quantity: `${Math.max(availableQuantity, 0)}/${book.quantity}`,
            };

            return res.json(result);
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async getAllBooksData(req, res) {
        try {
            const books = await this.Book.findAll({
                order: [['book_id', 'ASC']],
            });

            const result = [];

            for (const book of books) {
                const bookAuthors = await this.BookAuthor.findAll({
                    where: { book_id: book.book_id },
                    attributes: ['author_id']
                });

                const authorIds = bookAuthors.map(author => author.author_id);
                
                const authors = await this.Author.findAll({
                    where: { author_id: authorIds },
                    attributes: ['surname', 'name', 'patronymic'],
                }); 

                let allAuthors;

                if (authors.length > 0) {
                    allAuthors = authors.map((author) => {
                        let fullName = `${author.surname} ${author.name}`;
                        if (author.patronymic && author.patronymic.trim()) {
                            fullName += ` ${author.patronymic}`;
                        }
                        return fullName;
                    }).join(', ');
                } else {
                    allAuthors = '-';
                }

                const issuedCount = await Issue.count({
                    where: {
                        book_id: book.book_id,
                        status: { [Op.or]: ['Выдана', 'Просрочена'] },
                    },
                });

                const availableQuantity = book.quantity - issuedCount;

                const bookInfo = {
                    ...book.toJSON(),
                    authorsArray: authors.map((author) => ({
                        surname: author.surname,
                        name: author.name,
                        patronymic: author.patronymic
                    })),
                    authors: allAuthors,
                    available: availableQuantity,
                    available_quantity: `${Math.max(availableQuantity, 0)}/${book.quantity}`,
                };

                result.push(bookInfo);
            }

            return res.json(result);
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async createOrFindAuthor(attributes) {
        const { surname, name, patronymic } = attributes;
    
        const searchParams = { name };

        if (surname) {
            searchParams.surname = surname;
        }

        if (patronymic) {
            searchParams.patronymic = patronymic;
        }
    
        let existingAuthor = await this.Author.findOne({ where: searchParams });
    
        if (existingAuthor) {
            return existingAuthor.author_id;
        }
    
        const newAuthor = await this.Author.create(attributes);
        return newAuthor.author_id;
    }
    
    async editBook(req, res) {
        try {
            if (req.userData.role !== 'Библиограф') {
                return res.status(403).send('Доступ запрещен.');
            }
            const { book_id } = req.params;
            const { title, publish_year, isbn, code, quantity, authorsArray } = req.body;
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

            if (authorsArray && Array.isArray(authorsArray)) {
                await this.BookAuthor.destroy({ where: { book_id: book_id } });
                for (let i = 0; i < authorsArray.length; i++) {
                    const currentAuthor = authorsArray[i];
                    if (!currentAuthor.name) {
                        continue;
                    }
                    const authorId = await this.createOrFindAuthor(currentAuthor);
                    await this.BookAuthor.create({ book_id: book_id, author_id: authorId });
                }
            }
            res.status(200).send('Книга успешно обновлена.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async deleteBook(req, res) {
        try {
            if (req.userData.role !== 'Библиограф') {
                return res.status(403).send('Доступ запрещен.');
            }

            const { book_id } = req.params;

            const book = await this.Book.findByPk(book_id);

            if (!book) {
                return res.status(404).send('Книга не найдена.');
            }

            await this.BookAuthor.destroy({ where: { book_id: book_id } });

            await book.destroy();

            return res.status(200).send('Книга успешно удалена.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = BookController;