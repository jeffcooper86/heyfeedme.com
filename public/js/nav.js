module.exports.doNav = _doNav;

function _doNav() {
  var $navControl = $('.js-nav-ctrl'),
    $nav;

  $navControl.on('click', function() {
    $nav = $($(this).data('nav'));
    $nav.toggleClass('active');
  });
}
