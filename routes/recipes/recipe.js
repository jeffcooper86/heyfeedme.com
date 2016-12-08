var async = require('async');

var cache = require(process.cwd() + '/utils/cache');
var utils = require(process.cwd() + '/utils/global');
var Recipes = require(process.cwd() + '/models/Recipe');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipe',
    recipeId = req.params.recipeId,
    recipeQuery = Recipes.model.findById(recipeId)
    .populate('tags ingredients.recipe');

  async.waterfall([
    getRecipe,
    sortTags,
    recipeFilterMatch
  ], function(err) {
    if (err) {
      console.log(err);
      return res.render('_error500');
    }
    return res.render(template);
  });

  function getRecipe(cb) {
    var cached = cache.get(`recipe-${recipeId}`);
    if (cached) _recipeInfo(null, cached);
    recipeQuery.exec(_recipeInfo);

    function _recipeInfo(err, data) {
      if (!cached) cache.set(`recipe-${recipeId}`, data);
      l.data.recipe = data;
      l.title = data.seoDescription || `${utils.capitalizeTitles(data.name)} - Heyfeedme`;
      cb(err);
    }
  }

  function recipeFilterMatch(cb) {
    var recipe = l.data.recipe,
      catMatch = _recipeFilterMatch(req, res, recipe),
      msg = 'This recipe does not match your settings for: ',
      noMatch = [];

    if (!(catMatch[0] && catMatch[1])) {
      if (!catMatch[0]) noMatch.push('sections');
      if (!catMatch[1]) noMatch.push('diets');
      msg = msg + utils.capitalizeTitles(
        utils.i.stringifyArray(noMatch, ', ')
      );
      req.flash('warning', msg);
    }
    cb(null);
  }

  function sortTags(cb) {
    var r = l.data.recipe;
    if (r.tags) {
      r.tags = utils.i.sortOn({
        arr: r.tags,
        val: 'name'
      });
    }
    cb(null);
  }
};

function _recipeFilterMatch(req, res, recipe) {
  var activeCats = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    catMatch = activeCats[0] === 'all',
    classMatch = activeClasses[0] === 'all';

  recipe.categories.forEach(function(c) {
    if (activeCats.indexOf(c) > -1) catMatch = true;
  });
  recipe.classifications.forEach(function(c) {
    if (activeClasses.indexOf(c) > -1) classMatch = true;
  });

  return [catMatch, classMatch];
}
