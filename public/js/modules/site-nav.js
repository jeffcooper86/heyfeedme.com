const nav = require('../components/nav');

module.exports.init = init;

function init() {
  toggle({
    el: '.js-snav-ctrl'
  });
}

function toggle(opts) {
  nav.toggleCtrl({
    el: opts.el,
    beforeShow: _beforeShowNav,
    afterShow: _afterShow,
    afterHide: _afterHide
  });
}

function _afterHide(opts) {
  $(window).off('resize.siteNav');
}

function _afterShow(opts) {

  // Move outside the current click event loop.
  window.setTimeout(function() {
    $(document).one('click', function(e) {
      if (e.target !== opts.$ctrlEl[0]) nav.toggle(opts);
    });
  }, 0);
}

function _beforeShowNav(opts) {
  setNavPosition(opts);
  $(window).on('resize.siteNav', _setNavPosition);

  function _setNavPosition() {
    setNavPosition(opts);
  }
}

function setNavPosition(opts) {
  var $ctrlEl = opts.$ctrlEl,
    $nav = opts.$el,
    offset = $ctrlEl.offset();

  $nav.css({
    'right': $(document).width() - offset.left,
    'top': offset.top
  });
}
