// Server and client side global utils - avoid large libraries.

module.exports.slugify = slugify;
module.exports.stringifyArray = stringifyArray;
module.exports.tally = tally;
module.exports.trimDirectories = trimDirectories;
module.exports.unslugify = unslugify;


function slugify(route) {
  if (route) return route.replace(/[ ]/g, '-');
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

function tally(data, labels) {
  var count = data.length;
  return count + ' ' + (count > 1 || count === 0 ? labels[1] : labels[0]);
}

function trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}

function unslugify(route) {
  if (route) return route.replace('-', ' ');
  return '';
}
