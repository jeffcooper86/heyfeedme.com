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
  var modalEl = opts.modal.el,
    overlayEl = opts.overlay.el,
    clickOverlayToHide = opts.overlay.clickToHide;

  overlays.showOverlay({
    noScroll: true,
    el: overlayEl,
    cb: showModal,
    hide: {
      clickToHide: clickOverlayToHide,
      cb: hideModal
    }
  });

  function hideModal() {
    modals.hideModal({
      el: modalEl
    });
  }

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
