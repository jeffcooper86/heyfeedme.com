// Server and client side global utils - avoid large libraries.

module.exports.getFileExt = getFileExt;
module.exports.getNested = getNested;
module.exports.slugify = slugify;
module.exports.stringifyArray = stringifyArray;
module.exports.tally = tally;
module.exports.trimDirectories = trimDirectories;
module.exports.truncate = truncate;
module.exports.unslugify = unslugify;

function getFileExt(s) {
  var a = s.split('.');
  return a[a.length - 1];
}

function getNested(obj, p) {
  if (!obj) return;
  p = !Array.isArray(p) ? p.split('.') : p;
  if (p.length === 1) return obj[p[0]];
  return obj[p[0]] ? getNested(obj[p[0]], p.slice(1)) : undefined;
}

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
  var count = data.length !== undefined ? data.length : data;
  return count + ' ' + (count > 1 || count === 0 ? labels[1] : labels[0]);
}

function trimDirectories(path, trimAmount) {
  if (path[-1] === '/') path = path.slice(0, -1);
  return path.split('/').slice(0, -trimAmount).join('/');
}

function truncate(s, n) {
  var newS = '',
    i = 0;
  s = String(s);

  while (i < s.length && i < n) {
    newS += s[i];
    i += 1;
  }

  if (newS.length < s.length) newS = newS + '...';
  return newS;
}

function unslugify(route) {
  if (route) return route.replace('-', ' ');
  return '';
}
