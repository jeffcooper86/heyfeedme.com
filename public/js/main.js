var nav = require('./nav');
var filters = require('./filters');

nav.doNav();
filters.doFilters(function() {
  var $recipes = $('.m-recipe-listings');
  $.ajax({
    url: '/api/recipes/html' + window.location.search
  }).done(function(data) {
    data = JSON.parse(data);
    $recipes.replaceWith(data.recipesHtml);
  });
});
