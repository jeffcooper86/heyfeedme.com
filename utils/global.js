var _ = require('lodash');
var momentJs = require('moment');
var isomorphicUtils = require(process.cwd() + '/utils/_shared/global');

module.exports.i = isomorphicUtils;
module.exports.capitalizeFirst = capitalizeFirst;
module.exports.capitalizeTitles = capitalizeTitles;
module.exports.makeRandomFileName = makeRandomFileName;
module.exports.moment = moment;
module.exports.stripPrivates = stripPrivates;
module.exports.trimEmptyObjectsFromArray = trimEmptyObjectsFromArray;

function capitalizeFirst(str) {
  var words = str.split(' ');
  if (!words.length > 0) return str;
  words[0] = _.capitalize(words[0]);
  return words.join(' ');
}

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

function makeRandomFileName(ext) {
  return `${String(Math.random()).slice(2)}.${ext}`;
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
