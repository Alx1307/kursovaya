const { BookSearchStrategy, ReaderSearchStrategy, LibrarianSearchStrategy, IssueSearchStrategy } = require('../strategy');

class SearchController {
    constructor(strategy = null) {
      this.strategy = strategy;
    }
    
    setStrategy(strategy) {
      this.strategy = strategy;
    }

    async search(query) {
      if (!this.strategy) {
        throw new Error('Стратегия поиска не задана');
      }
      return await this.strategy.search(query);
    }
}

module.exports = SearchController;