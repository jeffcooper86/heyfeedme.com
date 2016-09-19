module.exports.doNav = doNav;

function doNav(opts) {
  var el = opts.el || '.js-nav-ctrl',
    $navControl = $(el),
    $nav;

  $navControl.on('click', function() {
    $nav = $($(this).data('nav'));
    $nav.toggleClass('active');
  });
}
