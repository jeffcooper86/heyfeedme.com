var _ = require('lodash');
var moment = require('moment')

module.exports.capitalizeTitles = capitalize_titles;
module.exports.moment = moment;
module.exports.slugify = slugify;
module.exports.stringifyArray = stringifyArray;
module.exports.stripPrivates = stripPrivates;
module.exports.tally = tally;
module.exports.trimDirectories = trimDirectories;
module.exports.unslugify = unslugify;

function capitalize_titles(title, skip) {
  var words = title.split(' '),
    skip = skip || ['of', 'the', 'and', 'de'];

  words.forEach(function(word, i) {
    if (skip.indexOf(word) < 0) {
      words[i] = _.capitalize(word);
    };
  });

  return words.join(' ');
}

function moment(date) {
  return moment(date);
}

function slugify(route) {
  if (route) return route.replace(/[ ]/g, "-");
  return '';
}

function stringifyArray(arr, separator, limit) {
  var str,
    extra = limit && arr.length - limit;
  arr = extra ? arr.slice(0, arr.length - extra) : arr;
  str = arr.join(separator);
  if (extra > 0) str += separator + 'and ' + extra + ' more...';
  return str;
}

function stripPrivates(schema) {
  return _.omitBy(schema, function(val, key) {
    return key[0] === '_';
  });
}

function tally(data, labels) {
  var count = data.length;
  return count + ' ' + (count > 1 || count == 0 ? labels[1] : labels[0]);
}

function trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}

function unslugify(route) {
  if (route) return route.replace("-", " ");
  return '';
}
