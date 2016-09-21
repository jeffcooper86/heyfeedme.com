var urlQuery = require('../utils/urlQuery');

module.exports.sortedTable = sortedTable;

function sortedTable(opts) {
  var $sortEls = $(opts.el);
  $sortEls.on('click', function() {
    var $this = $(this);
    urlQuery.updateUrlQuery(urlQuery.updateQueryParam(
      window.location.search, 'sort', [$this.data('sort')]
    ));
    window.location.reload();
  });
}
