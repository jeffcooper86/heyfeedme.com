const cookies = require('../utils/cookies');
const filters = require('../components/filters');
const nav = require('../components/nav');
const overlays = require('../components/overlays');
const recipeListings = require('./recipe-listings');
const ui = require('../ui');
const utils = require('../utils/iUtils');

module.exports.init = init;
module.exports.toggle = toggle;

var bodyClass = 'active-right-nav';

function init() {
  var $recipes = $('.m-recipe-listings');

  filters.doFilters({
    afterUpdate: _afterFilterUpdate,
    updateUrl: !!$recipes.length,
    el: '.js-filters > span'
  });

  toggle({
    el: '.js-rnav-ctrl'
  });
}

function toggle(opts) {
  nav.toggleCtrl({
    el: opts.el,
    beforeShow: _beforeShowNav,
    afterHide: _afterHideNav
  });
}

function _afterFilterUpdate() {
  var $recipe = $('.m-recipe'),
    $recipes = $('.m-recipe-listings');
  if ($recipes.length) recipeListings.updateRecipes($recipes);
  else if ($recipe.length === 1) _recipeMatchesFilters($recipe);
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
      $el: $('.js-right-nav')
    });
  }
}

function _recipeMatchesFilters($recipe) {
  $recipe = $recipe || $('.m-recipe');

  var recipe = $recipe.data('recipe'),
    categories = cookies.getCookie('sections'),
    classes = cookies.getCookie('diets'),
    catMatch = categories[0] === 'all',
    classMatch = classes[0] === 'all';

  // Matching categories.
  recipe.categories.forEach(function(c) {
    if (categories.indexOf(c) > -1) catMatch = true;
  });

  // Matching classes.
  recipe.classifications.forEach(function(c) {
    if (classes.indexOf(c) > -1) classMatch = true;
  });

  if (!(catMatch && classMatch)) {
    var flashEl = '.js-recipe-match',
      container = '.m-recipe',
      noMatch = [],
      msg = 'This recipe does not match your settings for: ';

    if (!catMatch) noMatch.push('Sections');
    if (!classMatch) noMatch.push('Diets');

    msg = msg + utils.stringifyArray(noMatch, ', ');

    ui.flash({
      el: flashEl,
      container: container,
      type: 'warning',
      msg: msg
    });
  } else {
    ui.flashRemove({
      el: flashEl,
      container: container
    });
  }
}

function _whenHideNav() {
  $('body').removeClass(bodyClass);
}
