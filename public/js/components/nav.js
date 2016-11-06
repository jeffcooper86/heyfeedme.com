module.exports.toggle = toggle;
module.exports.toggleCtrl = toggleCtrl;

function toggleCtrl(opts) {
  var el = opts.el || '.js-nav-ctrl',
    $navControl = $(el);

  $navControl.on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    toggle({
      $el: $($this.data('nav')),
      $ctrlEl: $this,
      beforeShow: opts.beforeShow,
      afterShow: opts.afterShow,
      afterHide: opts.afterHide
    });
  });
}

function toggle(opts) {
  var $nav = opts.$el,
    beforeShow = opts.beforeShow,
    afterShow = opts.afterShow,
    afterHide = opts.afterHide,
    show = !$nav.hasClass('active');

  if (show) {
    if (beforeShow) beforeShow(opts);
  }

  $nav.toggleClass('active');

  if (!show) {
    if (afterHide) afterHide(opts);
  } else {
    if (afterShow) afterShow(opts);
  }
}
