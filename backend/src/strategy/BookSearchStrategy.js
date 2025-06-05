const Book = require('../models/Book');
const { Op } = require('sequelize');
const SearchStrategy = require('./AbstractSearchStrategy');

class BookSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { code: { [Op.like]: `%${query}%` } }
                ]
            }
        });
    }
}

module.exports = BookSearchStrategy;