var _ = require('lodash');
var moment = require('moment')

module.exports.moment = _moment;
module.exports.slugify = _slugify;
module.exports.stripPrivates = _stripPrivates;
module.exports.tally = _tally;
module.exports.trimDirectories = _trimDirectories;
module.exports.unslugify = _unslugify;

function _moment(date) {
  return moment(date);
}

function _slugify(route) {
  if (route) return route.replace(/[ ]/g, "-");
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
}
