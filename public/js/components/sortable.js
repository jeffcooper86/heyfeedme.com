const sortable = require('sortablejs');

module.exports.init = init;

function init(opts) {
  createSortable(opts);
}


function createSortable(opts) {
  var el = opts.el;

  var sort = sortable.create(el, opts);
  if (!sort) console.log('Not sortable');
}
