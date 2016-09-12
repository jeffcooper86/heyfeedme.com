var recipesUtils = require(process.cwd() + '/utils/recipes');
var Recipes = require(process.cwd() + '/models/Recipe');

module.exports.html = function(req, res) {
  var pug = require(pug),
    t = process.cwd() + '/views/_mixins/recipes.pug';

  recipesUtils.getRecipes(
    Recipes, req.locals.data.recipes.activeCats, sendRecipes
  );

  function sendRecipes(err, recipes) {
    if (err) return res.render('_error500');
    return res.send(pug.renderFile(t, recipes));
  }
};
