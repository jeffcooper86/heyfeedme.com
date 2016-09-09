var _ = require('lodash');
var moment = require('moment');
var isomorphicUtils = require(process.cwd() + '/utils/_shared/global');

module.exports.i = isomorphicUtils;
module.exports.capitalizeTitles = capitalizeTitles;
module.exports.moment = moment;
module.exports.stripPrivates = stripPrivates;

function capitalizeTitles(title, skip) {
  var words = title.split(' ');
  skip = skip || ['of', 'the', 'and', 'de'];

  words.forEach(function(word, i) {
    if (skip.indexOf(word) < 0) {
      words[i] = _.capitalize(word);
    }
  });

  return words.join(' ');
}

function moment(date) {
  return moment(date);
}

function stripPrivates(schema) {
  return _.omitBy(schema, function(val, key) {
    return key[0] === '_';
  });
}
