var forms = require('../components/forms');
var urlQuery = require('../utils/url-query');
var recipeListings = require('./recipe-listings');

module.exports.init = init;

function init() {
  forms.eventSubmit({
    el: '.js-search',
    cb: _onSearch
  });

  function _onSearch($form) {
    var s = $form.find('input[name=search]').val(),
      oldS = urlQuery.getQueryParamValsFromQuery(
        window.location.search, 'search'
      ),
      $recipes = $('.m-recipe-listings');

    if (!s.length && !oldS.length) return;
    urlQuery.updateUrlQuery(
      urlQuery.updateQueryParam(window.location.search, 'search', [s])
    );
    recipeListings.updateRecipes($recipes);
  }
}
