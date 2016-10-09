// Server and client side global utils - avoid large libraries.

module.exports.chunk = chunk;
module.exports.getFileExt = getFileExt;
module.exports.getNested = getNested;
module.exports.slugify = slugify;
module.exports.sortVerticalFlowColumns = sortVerticalFlowColumns;
module.exports.stringifyArray = stringifyArray;
module.exports.stripFileExtension = stripFileExtension;
module.exports.tally = tally;
module.exports.trimDirectories = trimDirectories;
module.exports.truncate = truncate;
module.exports.unslugify = unslugify;

function chunk(data, n) {
  var newD = [],
    l = data.length;

  // Default to 2 chunks.
  n = (!n || n < 2) ? 2 : n;

  var chunk = Math.ceil(1 / n * l),
    chunked = 0;

  // Add each chunk.
  for (var chunkI = 0; chunkI < n; chunkI += 1) {
    newD.push([]);

    // Reduce the chunk amount by one after chunking all the left overs.
    if (chunkI === n - ((chunk * n) - l)) chunk -= 1;

    // Add to the chunks.
    for (var i = 0; i < chunk; i += 1) {
      chunked += 1;
      newD[chunkI][i] = data[chunked - 1];
    }
  }
  return newD;
}

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

function sortVerticalFlowColumns(data, n) {

  // Default to 2 columns.
  n = (!n || n < 2) ? 2 : n;
  var chunked = chunk(data, n),
    newD = [];

  for (var i = 0; i < Math.ceil((1 / n) * data.length); i += 1) {
    for (var j = 0; j < n; j += 1) {
      if (chunked[j][i]) newD.push(chunked[j][i]);
    }
  }
  return newD;
}

function stringifyArray(arr, separator, limit, more) {
  var str,
    extra = limit && arr.length - limit,
    moreTxt1 = more ? more[0] : 'and',
    moreTxt2 = more ? more[1] : 'more...';

  arr = extra ? arr.slice(0, arr.length - extra) : arr;
  str = arr.join(separator);
  if (extra > 0) str += `${separator}${moreTxt1}${extra}${moreTxt2}`;
  return str;
}

function stripFileExtension(s) {
  var a = s.split('.');
  a.pop();
  return a.join();
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
