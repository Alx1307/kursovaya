const Librarian = require('../models/Librarian');
const { Op } = require('sequelize');
const SearchStrategy = require('./AbstractSearchStrategy');

class LibrarianSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Librarian.findAll({
            where: {
                [Op.or]: [
                    { full_name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            }
        });
    }
}

module.exports = LibrarianSearchStrategy;