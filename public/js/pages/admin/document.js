var forms = require('../../components/forms');
var ui = require('../../ui');

forms.addField({
  el: '.js-form-add'
});

$('.js-form-actions .js-delete').on('click', function(e) {
  e.preventDefault();
  ui.showModalWithOverlay({
    modal: {
      el: '.js-modal'
    },
    overlay: {
      el: '.js-overlay'
    }
  });
});
