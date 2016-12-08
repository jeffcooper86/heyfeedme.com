var lru = require('lru-cache');
var opts = {
    max: 1000,
    maxAge: 1000 * 60 * 5
  },
  cache = lru(opts);

module.exports = cache;
