module.exports.hideOverlay = hideOverlay;
module.exports.showOverlay = showOverlay;

function hideOverlay(opts) {
  var $el = $(opts.el),
    cb = opts.cb;

  $el.removeClass('active');
  $('body').removeClass('no-scroll');
  if (cb) return cb();
}

function showOverlay(opts) {
  var noScroll = opts.noScroll,
    cb = opts.cb,
    $el = $(opts.el);

  $el.addClass('active');
  if (noScroll) $('body').addClass('no-scroll');
  if (cb) return cb();
}
