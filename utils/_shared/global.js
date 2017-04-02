// Server and client side global utils - avoid large libraries.

var arrayChunk = require('array-chunker');
var vfc = require('vfc');

module.exports.arrayChunk = arrayChunk;
module.exports.getFileExt = getFileExt;
module.exports.getNested = getNested;
module.exports.rotateRandom = rotateRandom;
module.exports.slugify = slugify;
module.exports.sortOn = sortOn;
module.exports.stringifyArray = stringifyArray;
module.exports.stripFileExtension = stripFileExtension;
module.exports.tally = tally;
module.exports.trimDirectories = trimDirectories;
module.exports.trimOn = trimOn;
module.exports.truncate = truncate;
module.exports.unslugify = unslugify;
module.exports.vfc = vfc;


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

function rotateRandom() {
  return `transform:rotate(${Math.ceil(Math.random() * 360)}deg);`;
}

function slugify(route, keepComma) {
  if (route) {
    if (!keepComma) route = route.replace(/[,]/g, '');
    return route.replace(/[ ]/g, '-');
  }
  return '';
}

function sortOn(opts) {
  return opts.arr.sort(function(a, b) {
    var compare;
    a = getNested(a, opts.val);
    b = getNested(b, opts.val);

    a = a ? String(a) : a;
    b = b ? String(b) : b;

    compare = a.localeCompare(b);
    if ('-1 desc'.split(' ').indexOf(opts.order) > -1) compare = compare * -1;
    return compare;
  });
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
  return trimOn(path, '/', trimAmount);
}

function trimOn(str, trim, amount) {
  return str.split(trim).slice(0, -amount).join(trim);
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
