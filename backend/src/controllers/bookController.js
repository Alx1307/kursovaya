const database = require('../config/database');
const sequelize = database.sequelize;
const Book = require('../models/Book')(sequelize);

//Добавление книги
exports.createBook = async (req, res) => {
    try {
        const data = req.body;

        const newBook = await Book.create(data);

        res.status(201).json(newBook).send('Книга успешно добавлена.');
    } catch(err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};