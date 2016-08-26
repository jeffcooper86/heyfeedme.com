var _ = require('lodash');
var moment = require('moment')

module.exports.moment = _moment;
module.exports.slugify = _slugify;
module.exports.stripPrivates = _stripPrivates;
module.exports.trimDirectories = _trimDirectories;
module.exports.unslugify = _unslugify;

function _moment(date) {
  return moment(date);
}

function _slugify(route) {
  return route.replace(" ", "-");
}

function _stripPrivates(schema) {
  return _.omitBy(schema, function(val, key) {
    return key[0] === '_';
  });
}

function _trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}

function _unslugify(route) {
  return route.replace("-", " ");
}
