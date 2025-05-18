const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

// const BookAuthor = sequelize.define('BookAuthor', {}, {
//     tableName: 'book_author',
//     timestamps: false
// });

const BookAuthor = sequelize.define('BookAuthor', {
    book_author_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Book',
            key: 'book_id'
        }
    },

    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Author',
            key: 'author_id'
        }
    }
}, {
    tableName: 'book_author',
    timestamps: false
});

module.exports = BookAuthor;