const database = require('../config/database');
const sequelize = database.sequelize;
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const Author = require('../models/Author');
const BookAuthor = require('../models/BookAuthor');

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

            // if (newBook instanceof Book) {
            //     console.log('newBook — это экземпляр модели Book.');
            // } else {
            //     console.error('newBook не является экземпляром модели Book.', typeof newBook, newBook.constructor.name);
            // }
            // console.log('Прототип newBook:', Object.getPrototypeOf(newBook));

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
                        // if (typeof newBook.addAuthor === 'function') {
                        //     await newBook.addAuthor(existingAuthor);
                        // } else {
                        //     console.error('Метод addAuthor недоступен.', newBook);
                        // }
                        // await newBook.addAuthor(existingAuthor);
                        const authorId = existingAuthor.author_id;
                        const bookId = newBook.book_id;
                        await this.BookAuthor.create({ book_id: bookId, author_id: authorId });
                    } else {
                        const newAuthor = await this.Author.create(currentAuthor);
                        // if (typeof newBook.addAuthor === 'function') {
                        //     await newBook.addAuthor(existingAuthor);
                        // } else {
                        //     console.error('Метод addAuthor недоступен.', newBook);
                        // }
                        //await newBook.addAuthor(newAuthor);
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
}

module.exports = BookController;