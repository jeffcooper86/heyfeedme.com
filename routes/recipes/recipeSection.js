var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipeSection',
    activeRecipeSections = res.locals.data.recipes.activeCats,
    recipesQuery;

  // Reset the activeRecipeSections cookies.
  recipesUtils.setActiveCategories(res, activeRecipeSections);

  if (activeRecipeSections &&
    activeRecipeSections.indexOf('all') < 0) {
    recipesQuery = Recipes.model.find()
      .where('categories').in(activeRecipeSections);
  } else {
    recipesQuery = Recipes.model.find();
  }

  async.waterfall([
    getAll
  ], function(err) {
    if (err) return res.render('_error500');
    return res.render(template);
  });

  function getAll(cb) {
    recipesQuery.exec(function(err, data) {
      l.data.recipes.recipes = data;
      cb(null);
    });
  }
};
