var ui = require('../ui');
var rightNav = require('../modules/right-nav');

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
  });
}
