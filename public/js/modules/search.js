var forms = require('../components/forms');
var urlQuery = require('../utils/urlQuery');
var ui = require('../ui.js');
var nav = require('../components/nav');

module.exports.init = init;

function init() {
  forms.eventSubmit({
    el: '.js-search',
    cb: function($form) {
      var search = $form.find('input[name=search]').val(),
        $recipes = $('.m-recipe-listings'),
        $recipesWrap = $recipes.find('.rlm-wrap');
      urlQuery.updateUrlQuery(
        urlQuery.updateQueryParam(window.location.search, 'search', [search])
      );
      ui.loadingStart($recipesWrap);
      $.ajax({
        url: '/api/recipes/html' + window.location.search
      }).done(function(data) {
        data = JSON.parse(data);
        ui.loadingStop($recipesWrap);
        $recipes.replaceWith(data.recipesHtml);
        nav.doNav({
          el: '.rlm-none .js-nav-ctrl'
        });
      });
    }
  });
}
