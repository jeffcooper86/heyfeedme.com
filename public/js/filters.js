module.exports.doFilters = doFilters;

function doFilters() {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      q = window.location.search,
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');
    $this.toggleClass('active');
    _updateUrlQuery($this.hasClass('active') ?
      _addToQueryParam(filter, param, q) :
      _stripFromQueryParam(filter, param, q)
    );
  });
}

function _addToQueryParam(addV, param, q) {
  if (!q.length) return '?' + param + '=' + addV;
  else if (q.indexOf(param + '=') > -1) {
    var r = new RegExp('(' + param + '=[^&]+)');
    return q.replace(r, '$1,' + addV);
  } else return q + '&' + param + '=' + addV;
}

function _getQueryParamVals(qp) {
  return qp.slice(qp.indexOf('=') + 1).split(',')
}

function _makeValidQuery(q) {
  return q.length && q[0] !== '?' ? '?' + q : q;
}

function _stripFromQueryParam(stripV, param, q) {
  var qParams = q.split('&'),
    newParams = [],
    newQ;
  qParams.forEach(function(qParam) {
    if (qParam.indexOf(param) > -1) {
      var pVals = _getQueryParamVals(qParam);

      // Remove the strip value or exclude the param if it was only value.
      if (pVals.length > 1) {
        pVals.splice(pVals.indexOf(stripV), 1);
        newParams.push(param + '=' + pVals.join(','));
      }
   } else newParams.push(qParam);
  });
  return _makeValidQuery(newParams.join('&'));
}

function _updateUrlQuery(q) {
  history.replaceState({}, '', window.location.pathname + q);

  // To do: Update through ajax.
  window.location.reload();
}
