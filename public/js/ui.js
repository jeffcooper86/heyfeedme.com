var modals = require('./components/modals');
var overlays = require('./components/overlays');

module.exports.loadingStart = loadingStart;
module.exports.loadingStop = loadingStop;
module.exports.showModalWithOverlay = showModalWithOverlay;

function loadingStart($el) {
  $el.addClass('ui-loading');
}

function loadingStop($el) {
  $el.removeClass('ui-loading');
}

function showModalWithOverlay(opts) {
  var modalEl = opts.modalEl,
    overlayEl = opts.overlayEl;

  overlays.showOverlay({
    noScroll: true,
    el: overlayEl,
    cb: showModal
  });

  function hideOverlay() {
    overlays.hideOverlay({
      el: overlayEl
    });
  }

  function showModal() {
    modals.showModal({
      el: modalEl,
      hide: {
        cb: hideOverlay
      }
    });
  }
}
