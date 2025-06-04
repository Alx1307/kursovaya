const SearchStrategy = require('./searchStrategy');
const Issue = require('../models/Issue');

class issueReaderSearchStrategy extends SearchStrategy {
    async search(query) {
        return await Issue.findAll({
            where: {
                reader_id: query,
            },
        });
    }
}
module.exports = issueReaderSearchStrategy;