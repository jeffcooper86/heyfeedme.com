var filters = require('../components/filters');
var nav = require('../components/nav');
var overlays = require('../components/overlays');
var recipeListings = require('./recipe-listings');

module.exports.init = init;
module.exports.toggle = toggle;

var bodyClass = 'active-right-nav',
  $recipes = $('.m-recipe-listings');

function init() {

  filters.doFilters({
    afterUpdate: _afterFilterUpdate,
    updateUrl: !!$recipes.length,
    el: '.js-filters > span'
  });

  toggle({});
}

function toggle(opts) {
  var el = opts.el;
  nav.toggleCtrl({
    el: el || '.js-nav-ctrl',
    beforeShow: _beforeShowNav,
    afterHide: _afterHideNav
  });
}

function _afterFilterUpdate() {
  if ($recipes.length) recipeListings.updateRecipes($recipes);
}

function _afterHideNav() {
  _whenHideNav();
  overlays.hideOverlay({
    el: '.js-overlay'
  });
}

function _beforeShowNav() {
  $('body').addClass(bodyClass);
  overlays.showOverlay({
    el: '.js-overlay',
    hide: {
      clickToHide: true,
      cb: _afterHideOverlay
    }
  });

  function _afterHideOverlay() {
    _whenHideNav();
    nav.toggle({
      el: '.js-right-nav'
    });
  }
}

function _whenHideNav() {
  $('body').removeClass(bodyClass);
}
