var _ = require('lodash');

module.exports.stripPrivates = _stripPrivates;
module.exports.trimDirectories = _trimDirectories;

function _stripPrivates(schema) {
  return _.omitBy(schema, function(val, key) {
    return key[0] === '_';
  });
}

function _trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}
