var filters = require('../components/filters');
var recipeListings = require('./recipe-listings');

module.exports.init = init;

function init() {
  filters.doFilters(function() {
    var $recipes = $('.m-recipe-listings');
    recipeListings.updateRecipes($recipes);
  });
}
