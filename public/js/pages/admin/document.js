var forms = require('../../components/forms');
var modalOverlay = require('../../components/groups/modal-with-overlay');
var suggest = require('../../components/suggests');

/**
 * Forms.
 */
forms.addField({
  el: '.js-form-add'
});

forms.shortcutSubmit({
  el: 'input, textarea',
  submitEl: '.js-form-update'
});

/**
 * Suggest data from available options - used for refs.
 */
suggest.autoSuggest({
  el: '.js-form-suggest',
  allowTyping: false,
  noDuplicates: true
});

/**
 * Show confirm modal before deleting.
 */
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
