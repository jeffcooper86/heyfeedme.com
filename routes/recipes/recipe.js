var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipe',
    recipeId = req.params.recipeId,
    recipeQuery = Recipes.model.findById(recipeId);

  async.waterfall([
    getRecipe
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
};
