var forms = require('../components/forms');
var urlq = require('urlq');
var recipeListings = require('./recipe-listings');

module.exports.init = init;

function init(dOpts) {
  var df = {};
  df.onSearch = _onSearch;
  df.updateSearch = _updateSearch;

  dOpts = $.extend(true, df, dOpts);

  forms.eventSubmit({
    el: '.js-search',
    cb: dOpts.onSearch
  });

  function _onSearch($form) {
    var s = $form.find('input[name=search]').val(),
      oldS = urlq.getParam(window.location.search, 'search');
    if (!s.length && !oldS.length) return;
    dOpts.updateSearch(s);
  }

  function _updateSearch(s) {
    var $recipes = $('.m-recipe-listings');
    urlq.updateQuery(urlq.updateParam(window.location.search, 'search', [s]));
    if ($recipes.length) recipeListings.updateRecipes($recipes);
  }
}
