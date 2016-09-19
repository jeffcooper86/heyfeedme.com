var forms = require('../components/forms');
var urlQuery = require('../utils/urlQuery');
var recipeListings = require('./recipe-listings');

module.exports.init = init;

function init() {
  forms.eventSubmit({
    el: '.js-search',
    cb: function($form) {
      var search = $form.find('input[name=search]').val(),
        $recipes = $('.m-recipe-listings');
      urlQuery.updateUrlQuery(
        urlQuery.updateQueryParam(window.location.search, 'search', [search])
      );
      recipeListings.updateRecipes($recipes);
    }
  });
}
