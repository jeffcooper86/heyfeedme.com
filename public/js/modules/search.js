var forms = require('../components/forms');
var urlQuery = require('../utils/urlQuery');

module.exports.init = init;

function init() {
  forms.eventSubmit({
    el: '.js-search',
    cb: function($form) {
      var search = $form.find('input[name=search]').val();
      urlQuery.updateUrlQuery(
        urlQuery.updateQueryParam(window.location.search, 'search', [search])
      );
      $.ajax({
        url: '/api/recipes/html' + window.location.search
      }).done(function(data) {
        var $recipes = $('.m-recipe-listings');
        data = JSON.parse(data);
        $recipes.replaceWith(data.recipesHtml);
      });
    }
  });
}
