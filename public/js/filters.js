module.exports.doFilters = doFilters;

function doFilters() {
  var $filterItems = $('.js-filters > span');

  $filterItems.on('click', function() {
    var $this = $(this),
      q = window.location.search,
      filter = $this.data('filter'),
      param = $this.closest('.js-filters').data('filters');
    $this.toggleClass('active');

    // Update the location and cookies
    if ($this.hasClass('active')) {
      _addToQueryParam(filter, param, q);
    } else {
      history.replaceState({}, '', window.location.pathname + _stripFromQueryParam(filter, param, q));

      // To do: Update through ajax.
      window.location.reload();
    }
  });
}

function _addToQueryParam(val, param, q) {

}

function _validQuery(q) {
  if (q.length && q[0] !== '?') q = '?' + q;
  return q;
}

function _stripFromQueryParam(stripV, param, q) {
  var qParams = q.split('&'),
    newParams = [],
    newQ;
  qParams.forEach(function(qParam) {
    var pVals;

    // Find the param to update.
    if (qParam.indexOf(param) > -1) {
      pVals = qParam.slice(qParam.indexOf('=') + 1).split(',');

      // Remove the strip value or exclude the param if it was only value.
      if (pVals.length > 1) {
        pVals.splice(pVals.indexOf(stripV), 1);
        newParams.push(param + '=' + pVals.join(','));
      }
   } else newParams.push(qParam);
  });
  return _validQuery(newParams.join('&'));
}
