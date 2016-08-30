var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipe',
    recipeId = req.params.recipeId,
    recipeQuery = Recipes.model.findById(recipeId);

  async.waterfall([
    getRecipe
  ], function(err) {
    return res.render(template);
  });

  function getRecipe(cb) {
    recipeQuery.exec(function(err, data) {
      l.data.recipe = data;
      l.title = data.description + ' - Heyfeedme';
      cb(null);
    });
  }
};
