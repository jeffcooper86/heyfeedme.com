var cookies = require('../utils/cookies');
var rightNav = require('../modules/right-nav');
var ui = require('../ui');
var urlQuery = require('../utils/url-query');

module.exports.sortOrder = sortOrder;
module.exports.updateRecipes = updateRecipes;

function updateRecipes($recipes) {
  var $recipesWrap = $recipes.find('.rlm-wrap'),
    loc = window.location.pathname;

  if (loc.indexOf('/recipes') === -1) loc = '/recipes';

  ui.loadingStart($recipesWrap);
  $.ajax({
    url: `/api${loc}/html${window.location.search}`
  }).done(function(data) {
    data = JSON.parse(data);
    ui.loadingStop($recipesWrap);
    $recipes.replaceWith(data.recipesHtml);

    // Attach new listeners.
    rightNav.toggle({
      el: '.rlm-none .js-nav-ctrl, .rlm-tally .js-nav-ctrl'
    });
    sortOrder();
  });
}

function sortOrder() {
  ui.eventChange({
    el: '.js-rlm-sort',
    cb: onChange
  });

  function onChange($this) {
    var cookie = $this.data('sort'),
      sort = $this.val(),
      $recipes = $('.m-recipe-listings');
    cookies.setCookie(cookie, sort);
    urlQuery.updateUrlQuery(
      urlQuery.updateQueryParam(window.location.search, 'sort', [sort])
    );
    updateRecipes($recipes);
  }
}
