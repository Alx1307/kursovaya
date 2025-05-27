// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database').sequelize;

// const Author = require('./Author');
// const Book = require('./Book');
// const BookAuthor = require('./BookAuthor');

// Book.belongsToMany(Author, { through: BookAuthor, foreignKey: 'book_id', otherKey: 'author_id' });
// Author.belongsToMany(Book, { through: BookAuthor, foreignKey: 'author_id', otherKey: 'book_id' });

// console.log('Связи между моделями:');
// console.log(Book.associations);
// console.log(Author.associations);

// module.exports = {
//     Author,
//     Book,
//     BookAuthor
// };