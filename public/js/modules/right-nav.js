var filters = require('../components/filters');
var nav = require('../components/nav');
var overlays = require('../components/overlays');
var recipeListings = require('./recipe-listings');

module.exports.init = init;
module.exports.toggle = toggle;

var bodyClass = 'active-right-nav';

function init() {
  filters.doFilters(function() {
    var $recipes = $('.m-recipe-listings');
    recipeListings.updateRecipes($recipes);
  });

  toggle({});
}

function toggle(opts) {
  var el = opts.el;

  nav.toggle({
    el: el || '.js-nav-ctrl',
    beforeShow: _beforeShow,
    afterHide: _afterHide
  });
}

function _afterHide() {
  $('body').removeClass(bodyClass);
  overlays.hideOverlay({
    el: '.js-overlay'
  });
}

function _beforeShow() {
  $('body').addClass(bodyClass);
  overlays.showOverlay({
    // noScroll: true,
    el: '.js-overlay'
  });
}
