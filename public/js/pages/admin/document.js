const forms = require('../../components/forms');
const modalOverlay = require('../../components/groups/modal-with-overlay');
const suggest = require('../../components/suggests');
const ui = require('../../ui');

/**
 * UI.
 */
ui.destroyEl({
  el: _getDestroyEl,
  destroyBefore: _destroyBefore
});

function _clearFormVals($el) {
  $el.find('input, textarea').val('');
}

function _destroyBefore($el) {

  // If only one, clear the input vals instead of destroying.
  if (!$el.siblings('.js-destroy-wrap').length) {
    _clearFormVals($el);
    return true;
  }
}

function _getDestroyEl($trigger) {
  return $trigger.closest('.js-destroy-wrap');
}

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
