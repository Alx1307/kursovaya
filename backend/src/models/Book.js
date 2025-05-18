const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

const Book = sequelize.define('Book', {
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    publish_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            correct_year(value) {
                if (!(value >= 1500 && value <= new Date().getFullYear())) {
                    throw new Error('Некорректный год публикации.');
                }
            }
        }
    },

    isbn: {
        type: DataTypes.STRING(17),
        allowNull: false,
        // validate: {
        //     correct_isbn(value) {
        //         if (!value.match(/^(97[89]\-)?(?:\d{1,5}-\d{1,7}-\d{1,6}-\d|\d{9}(\d|X))$/)) {
        //             throw new Error('Некорректный ISBN.');
        //         }
        //     }
        // },
        unique: {
            args: true,
            msg: 'Книга с таким ISBN уже зарегистрирована.'
        }
    },

    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        // validate: {
        //     correct_code(value) {
        //         if (!value.match(/^[0-9]{1,2}\.[0-9]{1,2}\/[А-Я]-[0-9]{1,2}$/)) {
        //             throw new Error('Некорректный книжный шифр.');
        //         }
        //     }
        // },
        unique: {
            args: true,
            msg: 'Такой книжный шифр уже занят.'
        }
    },

    date_added: {
        type: DataTypes.DATE,
        allowNull: true
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            correct_quantity(value) {
                if (!(value > 0 &&  value <= 100)) {
                    throw new Error('Некорректное количество книг.');
                }
            }
        }
    }
}, {
    tableName: 'book',
    timestamps: false
});

module.exports = Book;