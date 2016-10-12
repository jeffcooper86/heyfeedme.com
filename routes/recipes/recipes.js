var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipes',
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    searchQ = req.query.search,
    sort = req.query.sort || req.cookies.recipesListingsSort;

  // Set locals.
  l.data.search = searchQ;
  l.data.sort = sort;
  l.data.sortOptions = recipesUtils.getSortOptions();
  l.activeSections = activeSections;

  // Reset the cookies because the user may have edited them from the url.
  recipesUtils.setActiveCategories(res, activeSections);
  recipesUtils.setActiveClasses(res, activeClasses);
  recipesUtils.setSort(res, sort);

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
