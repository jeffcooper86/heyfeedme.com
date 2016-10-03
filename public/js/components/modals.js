module.exports.hideModal = hideModal;
module.exports.showModal = showModal;

function showModal(opts) {
  var $el = $(opts.el),
    hideCb = opts.hide && opts.hide.cb,
    confirmCb = opts.confirm;

  $el.addClass('active');
  if (confirmCb) {
    $('.js-modal-confirm').on('click', function() {
      return confirmCb();
    });
  }
  $('.js-modal-dismiss').on('click', function() {
    $('.js-modal-dismiss').off('click');
    hideModal({
      el: $el,
      cb: hideCb
    });
  });
}

function hideModal(opts) {
  var $el = $(opts.el),
    cb = opts.cb;

  $el.removeClass('active');
  if (cb) return cb();
}
