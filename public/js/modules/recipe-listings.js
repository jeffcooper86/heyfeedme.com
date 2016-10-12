var cookies = require('../utils/cookies');
var rightNav = require('../modules/right-nav');
var ui = require('../ui');

module.exports.sortOrder = sortOrder;
module.exports.updateRecipes = updateRecipes;

function updateRecipes($recipes) {
  var $recipesWrap = $recipes.find('.rlm-wrap');

  ui.loadingStart($recipesWrap);
  $.ajax({
    url: '/api/recipes/html' + window.location.search
  }).done(function(data) {
    data = JSON.parse(data);
    ui.loadingStop($recipesWrap);
    $recipes.replaceWith(data.recipesHtml);

    // Attach new listeners.
    rightNav.toggle({
      el: '.rlm-none .js-nav-ctrl, .rlm-tally .js-nav-ctrl'
    });
    sortOrder();
    ui.updateState();
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
    updateRecipes($recipes);
  }
}
