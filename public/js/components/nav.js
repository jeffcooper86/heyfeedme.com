module.exports.toggle = toggle;

function toggle(opts) {
  var el = opts.el || '.js-nav-ctrl',
    beforeShow = opts.beforeShow,
    afterHide = opts.afterHide,
    $navControl = $(el);

  $navControl.on('click', function(e) {
    e.preventDefault();
    var $this = $(this),
      $nav = $($this.data('nav'));

    if (!($nav.hasClass('active')) && beforeShow) beforeShow();

    $nav.toggleClass('active');

    if (!$nav.hasClass('active') && afterHide) afterHide();
  });
}
