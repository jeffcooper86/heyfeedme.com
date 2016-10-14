var async = require('async');
var utils = require(process.cwd() + '/utils/global');
var Recipes = require(process.cwd() + '/models/Recipe');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipe',
    recipeId = req.params.recipeId,
    recipeQuery = Recipes.model.findById(recipeId);

  async.waterfall([
    getRecipe,
    recipeFilterMatch
  ], function(err) {
    if (err) return res.render('_error500');
    return res.render(template);
  });

  function getRecipe(cb) {
    recipeQuery.exec(function(err, data) {
      l.data.recipe = data;
      l.title = data.seoDescription;
      cb(null);
    });
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
