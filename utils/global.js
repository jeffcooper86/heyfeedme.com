var _ = require('lodash');
var momentJs = require('moment');
var isomorphicUtils = require(process.cwd() + '/utils/_shared/global');

module.exports.i = isomorphicUtils;
module.exports.capitalizeTitles = capitalizeTitles;
module.exports.moment = moment;
module.exports.stripPrivates = stripPrivates;
module.exports.trimEmptyObjectsFromArray = trimEmptyObjectsFromArray;

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
  return momentJs(date);
}

function stripPrivates(d) {
  return _.omitBy(d, function(val, key) {
    return key[0] === '_';
  });
}

function trimEmptyObjectsFromArray(a) {
  _.remove(a, function(obj) {
    var isEmpty = true;
    _.forEach(obj, function(v) {
      if (v.length) isEmpty = false;
    });
    return isEmpty;
  });
}
