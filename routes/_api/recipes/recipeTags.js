var RecipeTags = require(process.cwd() + '/models/RecipeTag');
var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  recipesUtils.getRecipesTags(RecipeTags, {}, sendRecipeTags);

  function sendRecipeTags(err, tags) {
    res.send(JSON.stringify(tags));
  }
};
