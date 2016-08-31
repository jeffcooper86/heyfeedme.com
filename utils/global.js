var _ = require('lodash');
var moment = require('moment')

module.exports.capitalizeTitles = _capitalize_titles;
module.exports.moment = _moment;
module.exports.slugify = _slugify;
module.exports.stringifyArray = _stringifyArray;
module.exports.stripPrivates = _stripPrivates;
module.exports.tally = _tally;
module.exports.trimDirectories = _trimDirectories;
module.exports.unslugify = _unslugify;

function _capitalize_titles(title, skip) {
  var words = title.split(' '),
    skip = skip || ['of', 'the', 'and', 'de'];

  words.forEach(function(word, i) {
    if (skip.indexOf(word) < 0) {
      words[i] = _.capitalize(word);
    };
  });

  return words.join(' ');
}

function _moment(date) {
  return moment(date);
}

function _slugify(route) {
  if (route) return route.replace(/[ ]/g, "-");
  return '';
}

function _stringifyArray(arr, separator, limit) {
  var str,
    extra = limit && arr.length - limit;
  arr = extra ? arr.slice(0, arr.length - extra) : arr;
  str = arr.join(separator);
  if (extra > 0) str += separator + 'and ' + extra + ' more...';
  return str;
}

function _stripPrivates(schema) {
  return _.omitBy(schema, function(val, key) {
    return key[0] === '_';
  });
}

function _tally(data, labels) {
  var count = data.length;
  return count + ' ' + (count > 1 || count == 0 ? labels[1] : labels[0]);
}

function _trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}

function _unslugify(route) {
  if (route) return route.replace("-", " ");
  return '';
}
