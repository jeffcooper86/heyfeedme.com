var urlq = require('urlq');

module.exports.sortedTable = sortedTable;

function sortedTable(opts) {
  var $sortEls = $(opts.el);
  $sortEls.on('click', function() {
    var $this = $(this);
    urlq.updateQuery(urlq.updateParam(
      window.location.search, 'sort', [$this.data('sort')]
    ));
    window.location.reload();
  });
}
