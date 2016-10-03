var forms = require('../../components/forms');
var overlays = require('../../components/overlays');
var modals = require('../../components/modals');

forms.addField({
  el: '.js-form-add'
});

$('.js-form-actions .js-delete').on('click', function(e) {
  e.preventDefault();
  overlays.showOverlay({
    noScroll: true,
    el: '.js-overlay',
    cb: showModal
  });
});

function hideOverlay() {
  overlays.hideOverlay({
    el: '.js-overlay'
  });
}

function showModal() {
  modals.showModal({
    el: '.js-modal',
    hide: {
      cb: hideOverlay
    }
  });
}
