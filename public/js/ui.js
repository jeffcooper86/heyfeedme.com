module.exports.loadingStart = loadingStart;
module.exports.loadingStop = loadingStop;

function loadingStart($el) {
  $el.addClass('ui-loading');
}

function loadingStop($el) {
  $el.removeClass('ui-loading');
}
