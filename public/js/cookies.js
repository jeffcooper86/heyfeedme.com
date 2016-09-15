var cookiesJs = require('cookies-js');
var iUtils = require('../../utils/_shared/global');

module.exports.addValToCookieArray = addValToCookieArray;
module.exports.getCookie = getCookie;
module.exports.removeValFromCookieArray = removeValFromCookieArray;
module.exports.setCookie = setCookie;

function addValToCookieArray(name, v) {
  var cookieV = getCookie(name);

  // If it was all before, reset to empty array before adding.
  if (cookieV.length === 1 && cookieV.indexOf('all') > -1) {
    cookieV = [];
  }

  cookieV.push(iUtils.unslugify(v));
  setCookie(name, cookieV);
}

function getCookie(n) {
  var cookie = cookiesJs.get(n);

  // Not sure why but cookies saved by server start with 'j:'
  if (cookie.length > 2 && cookie[1] === ':') {
    cookie = cookie.slice(2);
  }
  return JSON.parse(cookie);
}

function removeValFromCookieArray(name, v, defaultV) {
    var cookieV = getCookie(name),
      i = cookieV.indexOf(iUtils.unslugify(v));
    if (i > -1) {
      cookieV.splice(i, 1);
    }
    if (!cookieV.length) cookieV = defaultV;
    setCookie(name, cookieV);
}

function setCookie(name, v) {
  if (typeof(v) !== 'string') v = JSON.stringify(v);
  cookiesJs.set(name, v);
}
