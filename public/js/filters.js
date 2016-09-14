var cookiesJs = require('cookies-js');
var iUtils = require('../../utils/_shared/global');
var utils = require('./utils');

module.exports.doFilters = doFilters;
function doFilters(cb) {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');

    // Reset the filter to all.
    if (filter === 'all') {
      $this.addClass('active').siblings().removeClass('active');
      _setCookie(param, ['all']);
    } else {
      $this.toggleClass('active');

      // Add the filter.
      if ($this.hasClass('active')) {
        $this.siblings('[data-filter=all]').removeClass('active');
        _addValToCookie(param, filter);

      // Remove the filter.
      } else {
        if (!$this.siblings('.active').length) {
          $this.siblings('[data-filter=all]').addClass('active');
        }
        _removeValFromCookie(param, filter);
      }
    }

    _updateUrlQueryFromCookie(param);
    if (cb) cb();
  });
}

function _addValToCookie(name, v) {
  var cookieV = _getCookie(name);

  // If it was all before, reset to empty array.
  if (cookieV.length === 1 && cookieV.indexOf('all') > -1) {
    cookieV = [];
  }

  cookieV.push(iUtils.unslugify(v));
  _setCookie(name, cookieV);
}

function _updateUrlQueryFromCookie(name) {
  var q = window.location.search;
  return utils.updateUrlQuery(
    iUtils.slugify(`?${name}=` + _getCookie(name).join(','))
  );
}

function _getCookie(n) {
  var cookie = cookiesJs.get(n);

  // Not sure why but cookies saved by server start with 'j:'
  if (cookie.length > 2 && cookie[1] === ':') {
    cookie = cookie.slice(2);
  }

  return JSON.parse(cookie);
}

function _removeValFromCookie(name, v) {
    var cookieV = _getCookie(name),
      i = cookieV.indexOf(iUtils.unslugify(v));
    if (i > -1) {
      cookieV.splice(i, 1);
    }
    if (!cookieV.length) cookieV = ['all'];
    _setCookie(name, cookieV);
}

function _setCookie(name, v) {
  if (typeof(v) !== 'string') v = JSON.stringify(v);
  cookiesJs.set(name, v);
}
