const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const { Op } = require('sequelize');
const SearchStrategy = require('./AbstractSearchStrategy');

class IssueSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Issue.findAll({
            include: [
              { model: Book, where: { code: { [Op.iLike]: `%${query}%` } }, required: false },
              { model: Reader, where: { card_number: { [Op.iLike]: `%${query}%` } }, required: false }
            ]
        });
    }
}

module.exports = IssueSearchStrategy;