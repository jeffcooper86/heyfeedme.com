module.exports.doFilters = doFilters;

function doFilters() {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      q = window.location.search,
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');
    $this.toggleClass('active');
    if (filter === 'all') {
      $this.siblings().removeClass('active');
      _updateUrlQuery(_stripParamFromQuery(param, q));
    } else {
      if ($this.hasClass('active')) {
        $this.siblings('[data-filter=all]').removeClass('active');
        _updateUrlQuery(_addToQueryParam(filter, param, q));
      } else {
        if (!$this.siblings('.active').length) {
          $this.siblings('[data-filter=all]').addClass('active');
        }
        _updateUrlQuery(_stripFromQueryParam(filter, param, q));
      }
    }
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
  var r = new RegExp('&?' + p + '=[^&]*');
  return _makeValidQuery(q.replace(r, ''));
}

function _updateUrlQuery(q) {
  history.replaceState({}, '', window.location.pathname + q);

  // To do: Update through ajax.
  // window.location.reload();
}
