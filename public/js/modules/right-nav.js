var filters = require('../components/filters');

module.exports.init = init;

function init() {
  filters.doFilters(function() {
    var $recipes = $('.m-recipe-listings');
    $.ajax({
      url: '/api/recipes/html' + window.location.search
    }).done(function(data) {
      data = JSON.parse(data);
      $recipes.replaceWith(data.recipesHtml);
    });
  });
}
