var nav = require('./nav');
var filters = require('./filters');
var iUtils = require('../../utils/_shared/global');

nav.doNav();
filters.doFilters(function() {
  var $recipes = $('.m-recipe-listings'),
    $recipesTally = $('.js-recipes-tally');
  $.ajax({
    url: '/api/recipes/html' + window.location.search
  }).done(function(data) {
    data = JSON.parse(data);
    $recipes.replaceWith(data.recipesHtml);
    $recipesTally.html(iUtils.tally(data.recipesCount, ['recipe', 'recipes']));
  });
});
