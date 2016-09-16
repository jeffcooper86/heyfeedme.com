var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipes',
    activeRecipeSections = res.locals.data.recipes.activeCats,
    search = req.query.search;

  // Set locals.
  l.data.search = search;

  // Reset the activeRecipeSections cookies.
  recipesUtils.setActiveCategories(res, activeRecipeSections);

  async.waterfall([
    getAll
  ], function(err, data) {
    if (err) return res.render('_error500');
    l.data.recipes.recipes = data;
    return res.render(template);
  });

  function getAll(cb) {
    recipesUtils.getRecipes(Recipes, activeRecipeSections, cb);
  }
};
