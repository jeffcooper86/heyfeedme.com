module.exports.hideOverlay = hideOverlay;
module.exports.showOverlay = showOverlay;

function hideOverlay(opts) {
  var $el = $(opts.el),
    cb = opts.cb;

  $el.off('click');
  $el.removeClass('active');
  $('body').removeClass('no-scroll');
  if (cb) return cb();
}

function showOverlay(opts) {
  var noScroll = opts.noScroll,
    clickToHide = opts.hide.clickToHide,
    cb = opts.cb,
    $el = $(opts.el);

  $el.addClass('active');

  // Don't let the body scroll.
  if (noScroll) $('body').addClass('no-scroll');

  // Click the overlay to hide it.
  if (clickToHide) {
    $el.on('click', function() {
      hideOverlay({
        el: opts.el,
        cb: opts.hide.cb
      });
    });
  }

  // Cb after showing the overlay.
  if (cb) return cb();
}
