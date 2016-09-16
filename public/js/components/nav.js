module.exports.doNav = doNav;

function doNav() {
  var $navControl = $('.js-nav-ctrl'),
    $nav;

  $navControl.on('click', function() {
    $nav = $($(this).data('nav'));
    $nav.toggleClass('active');
  });
}
