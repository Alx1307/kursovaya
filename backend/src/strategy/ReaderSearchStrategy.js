const Reader = require('../models/Reader');
const { Op } = require('sequelize');
const SearchStrategy = require('./AbstractSearchStrategy');

class ReaderSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Reader.findAll({
            where: {
                [Op.or]: [
                    { phone: { [Op.like]: `%${query}%` } },
                    { card_number: { [Op.like]: `%${query}%` } }
                ]
            }
        });
    }
}

module.exports = ReaderSearchStrategy;