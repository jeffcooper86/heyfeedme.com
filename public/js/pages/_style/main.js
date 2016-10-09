var modals = require('../../components/modals');
var overlays = require('../../components/overlays');
var ui = require('../../ui');

/**
 * Components.
 * ----------------------------
 */


/**
 * Modals.
 */
$('.js-modal-ctrl').on('click', function() {
  var modal = $(this).data('modal');
  modals.showModal({
    el: modal
  });
});

$('.js-modal-overlay-ctrl').on('click', function() {
  var modal = $(this).data('modal');
  ui.showModalWithOverlay({
    modal: {
      el: modal
    },
    overlay: {
      el: '.js-overlay-1',
      clickToHide: true
    }
  });
});


/**
 * Overlays.
 */
$('.js-overlay-ctrl').on('click', function() {
  var overlay = $(this).data('overlay');
  overlays.showOverlay({
    el: overlay,
    hide: {
      clickToHide: true
    }
  });
});
