var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipes',
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    searchQ = req.query.search,
    sort = req.cookies.recipesListingsSort;

  // Set locals.
  l.data.search = searchQ;
  l.data.sort = sort;
  l.data.sortOptions = recipesUtils.getSortOptions();
  l.activeSections = activeSections;

  // Reset the activeSections cookies.
  recipesUtils.setActiveCategories(res, activeSections);

  async.waterfall([
    getAll,
    search
  ], function(err, data) {
    if (err) return res.render('_error500');
    l.data.recipes.recipes = data;
    return res.render(template);
  });

  function getAll(cb) {
    var filters = {
      activeSections: activeSections,
      activeClasses: activeClasses
    };
    recipesUtils.getRecipes(Recipes, filters, sort, cb);
  }

  function search(recipes, cb) {
    cb(null, recipesUtils.searchRecipes(recipes, searchQ));
  }
};
