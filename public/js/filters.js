var cookiesJs = require('cookies-js');
var iUtils = require('../../utils/_shared/global');

module.exports.doFilters = doFilters;
function doFilters(cb) {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      q = window.location.search,
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');

    // Reset the filter.
    if (filter === 'all') {
      $this.addClass('active');
      $this.siblings().removeClass('active');
      _updateUrlQuery(_stripParamFromQuery(param, q));
      _setCookie(param, ['all']);
    } else {
      $this.toggleClass('active');

      // Add the filter to the query.
      if ($this.hasClass('active')) {
        $this.siblings('[data-filter=all]').removeClass('active');
        _updateUrlQuery(_addToQueryParam(filter, param, q));
        _addValToCookie(param, filter);

        // The query was not in the original url so add them all.
        if (!_getQueryParamValsFromQuery(q, param).length) {
          _updateUrlQuery(_buildUrlQueryFromCookie(param));
        }

      // Remove the filter.
      } else {
        _updateUrlQuery(_stripFromQueryParam(filter, param, q));
        _removeValFromCookie(param, filter);
        if (!$this.siblings('.active').length) {
          $this.siblings('[data-filter=all]').addClass('active');
        } else if (!_getQueryParamValsFromQuery(q, param).length) {
          _updateUrlQuery(_buildUrlQueryFromCookie(param));
        }
      }
    }

    // Callback.
    if (cb) cb();
  });
}

function _addToQueryParam(addV, p, q) {
  var rStr;
  if (!q.length) return '?' + p + '=' + addV;
  else if (q.indexOf(p + '=') > -1) {
    rStr = _getQueryParamValsFromQuery(q, p).length ? '$1,' : '$1';
    return q.replace(_makeQueryParamRegex(p), rStr + addV);
  } else return q + '&' + p + '=' + addV;
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

function _buildUrlQueryFromCookie(name) {
  return iUtils.slugify(`?${name}=` + _getCookie(name).join(','));
}

function _getCookie(n) {
  var cookie = cookiesJs.get(n);

  // Not sure why but cookies saved by server start with 'j:'
  if (cookie.length > 2 && cookie[1] === ':') {
    cookie = cookie.slice(2);
  }

  return JSON.parse(cookie);
}

function _getQueryParamVals(qp) {
  var strippedQp = qp.slice(qp.indexOf('=') + 1);
  return strippedQp.length ? strippedQp.split(',') : [];
}

function _getQueryParamValsFromQuery(q, p) {
  var qp = q.match(_makeQueryParamRegex(p));
  return qp ? _getQueryParamVals(qp[0]) : [];
}

function _makeQueryParamRegex(p) {
  return new RegExp('&?(' + p + '=[^&]*)');
}

function _makeValidQuery(q) {
  var newQ = q[0] !== '?' ? '?' + q : q;
  newQ = newQ[1] === '&' ? newQ[0] + newQ.slice(2): newQ;
  return newQ === '?' ? '' : newQ;
}

function _removeValFromCookie(name, v) {
    var cookieV = _getCookie(name),
      i = cookieV.indexOf(iUtils.unslugify(v));
    if (i > -1) {
      cookieV.splice(i, 1);
    }
    _setCookie(name, cookieV);
}

function _setCookie(name, v) {
  if (typeof(v) !== 'string') v = JSON.stringify(v);
  cookiesJs.set(name, v);
}

function _stripFromQueryParam(stripV, p, q) {
  var qParams = q.split('&'),
    newParams = [];
  qParams.forEach(function(qParam) {
    if (qParam.indexOf(p) > -1) {
      var pVals = _getQueryParamVals(qParam);

      // Don't modify the param if sripV is not in it.
      if (pVals.indexOf(stripV) === -1) newParams.push(qParam);

      // Remove the strip value or exclude the param if it was only value.
      else if (pVals.length > 1) {
        pVals.splice(pVals.indexOf(stripV), 1);
        newParams.push(p + '=' + pVals.join(','));
      }
   } else newParams.push(qParam);
  });
  return _makeValidQuery(newParams.join('&'));
}

function _stripParamFromQuery(p, q) {
  return _makeValidQuery(q.replace(_makeQueryParamRegex(p), ''));
}

function _updateUrlQuery(q) {
  history.replaceState({}, '', window.location.pathname + q);
}
