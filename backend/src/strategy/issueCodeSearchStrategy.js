const SearchStrategy = require('./searchStrategy');
const Issue = require('../models/Issue');

class issueCodeSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Issue.findAll({
            where: {
                book_id: query,
            },
        });
    }
}

module.exports = issueCodeSearchStrategy;