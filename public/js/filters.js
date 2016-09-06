module.exports.doFilters = doFilters;

function doFilters() {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      q = window.location.search,
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters'),
      qParams;
    $this.toggleClass('active');

    // Reset the filter.
    if (filter === 'all') {
      $this.siblings().removeClass('active');
      _updateUrlQuery(_stripParamFromQuery(param, q));
    } else {

      // Add the filter to the query.
      if ($this.hasClass('active')) {
        $this.siblings('[data-filter=all]').removeClass('active');
        _updateUrlQuery(_addToQueryParam(filter, param, q));

        // The query was not in the original url so add them all.
        if (!_getQueryParamValsFromQuery(q, param).length) {
          $this.siblings('.active').each(function(i, el) {
            _updateUrlQuery(_addToQueryParam(
              $(el).data('filter'), param, window.location.search)
            );
          });
        }

      // Remove the filter.
      } else {
        if (!$this.siblings('.active').length) {
          $this.siblings('[data-filter=all]').addClass('active');
        }
        _updateUrlQuery(_stripFromQueryParam(filter, param, q));
      }
    }
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

  // To do: Update through ajax.
  // window.location.reload();
}
