const forms = require('../../components/forms');
const modalOverlay = require('../../components/groups/modal-with-overlay');
const suggest = require('../../components/suggests');
const formFieldDestroy = require('../../components/groups/form-field-destroy');
const ui = require('../../ui');

/**
 * Forms.
 */
forms.addField({
  el: '.js-form-add'
});

forms.characterLimit();

forms.shortcutSubmit({
  el: 'input, textarea',
  submitEl: '.js-form-update'
});

formFieldDestroy.destroy();

/**
 * Suggest data from available options - used for refs.
 */
suggest.autoSuggest({
  el: '.js-form-suggest',
  allowTyping: false,
  noDuplicates: true,
  loadingStart: ui.loadingStart,
  loadingStop: ui.loadingStop
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
