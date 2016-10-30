const clearFormVals = require('../forms').clearFieldVals;
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
      clearFormVals($el);
      return true;
    }
  }

  function _getDestroyEl($trigger) {
    return $trigger.closest('.js-destroy-wrap');
  }
}
