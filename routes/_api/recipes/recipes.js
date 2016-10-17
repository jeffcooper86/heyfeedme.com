var pug = require('pug');

var recipesUtils = require(process.cwd() + '/utils/recipes');
var Recipes = require(process.cwd() + '/models/Recipe');
var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    t = process.cwd() + '/views/_mixins/recipes.pug',
    searchQ = req.query.search,
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    filters = {
      activeSections: activeSections,
      activeClasses: activeClasses
    },
    sort = req.cookies.recipesListingsSort,
    tag = utils.i.unslugify(req.params.tag);

  recipesUtils.getRecipes(Recipes, filters, sort, searchRecipes);

  function searchRecipes(err, recipes) {
    if (err) return sendRecipes(err);
    if (searchQ) recipes = recipesUtils.searchRecipes(recipes, searchQ);
    sendRecipes(null, recipes);
  }

  function sendRecipes(err, recipes) {
    var data = {};
    if (err) res.render('_error500');
    else if (req.params.html) {
      l.recipes = recipes;
      l.activeSections = activeSections;
      l.data.tag = tag;
      l.compileRecipes = true;
      l.data.sort = sort;
      l.data.sortOptions = recipesUtils.getSortOptions();
      if (tag) {
        l.crumbs = [
          ['tags', '/recipes/tags'],
          [tag]
        ];
      }
      data.recipesHtml = pug.renderFile(t, l);
      data.recipesCount = recipes.length;
      res.send(JSON.stringify(data));
    } else {
      res.send(JSON.stringify(recipes));
    }
  }
};
