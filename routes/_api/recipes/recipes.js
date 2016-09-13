var recipesUtils = require(process.cwd() + '/utils/recipes');
var Recipes = require(process.cwd() + '/models/Recipe');
var pug = require('pug');

exports = module.exports = function(req, res) {
  var l = res.locals,
    t = process.cwd() + '/views/_mixins/recipes.pug';
  recipesUtils.getRecipes(
    Recipes, res.locals.data.recipes.activeCats, sendRecipes
  );

  function sendRecipes(err, recipes) {
    var data = {};
    if (err) res.render('_error500');
    else if (req.params.html) {
      l.recipes = recipes;
      l.compileRecipes = true;
      data.recipesHtml = pug.renderFile(t, l);
      data.recipesCount = recipes.length;
      res.send(JSON.stringify(data));
    } else {
      res.send(JSON.stringify(recipes));
    }
  }
};
