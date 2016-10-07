module.exports.toggle = toggle;
module.exports.toggleCtrl = toggleCtrl;

function toggleCtrl(opts) {
  var el = opts.el || '.js-nav-ctrl',
    $navControl = $(el);

  $navControl.on('click', function(e) {
    e.preventDefault();
    toggle({
      el: $(this).data('nav'),
      beforeShow: opts.beforeShow,
      afterHide: opts.afterHide
    });
  });
}

function toggle(opts) {
  var $nav = $(opts.el),
    beforeShow = opts.beforeShow,
    afterHide = opts.afterHide;

  if (!($nav.hasClass('active')) && beforeShow) beforeShow();

  $nav.toggleClass('active');

  if (!$nav.hasClass('active') && afterHide) afterHide();
}
