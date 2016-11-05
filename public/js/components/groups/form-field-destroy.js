const clearFormVals = require('../forms').clearFieldVals;
const charLimitFields = require('../forms').characterLimitFields();
const charLimitUpdate = require('../forms').characterLimitUpdate;
const ui = require('../../ui');

module.exports.destroy = destroy;

function destroy() {
  ui.destroyEl({
    el: _getDestroyEl,
    destroyBefore: _destroyBefore
  });

  function _destroyBefore($el) {

    // If only one, clear the input vals instead of destroying.
    if (!$el.siblings('.js-destroy-wrap').length) {
      var $fields = $el.find(charLimitFields);

      // Clear before updating character limit!
      clearFormVals($el);
      $fields.each(function(i, f) {
        charLimitUpdate($(f));
      });
      return true;
    }
  }

  function _getDestroyEl($trigger) {
    return $trigger.closest('.js-destroy-wrap');
  }
}
