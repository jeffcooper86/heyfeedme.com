var forms = require('../../components/forms');
var modalOverlay = require('../../components/groups/modal-with-overlay');

forms.addField({
  el: '.js-form-add'
});

$('.js-form-actions .js-delete').on('click', function(e) {
  e.preventDefault();
  modalOverlay.showModalWithOverlay({
    modal: {
      el: '.js-modal'
    },
    overlay: {
      el: '.js-overlay'
    }
  });
});
