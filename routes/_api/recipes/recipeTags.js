var RecipeTags = require(process.cwd() + '/models/RecipeTag');
var recipesUtils = require(process.cwd() + '/utils/recipes');

var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var skip = utils.i.getNested(req, 'query.skip'),
    opts = {
      skip: skip ? JSON.parse(skip) : null
    };
  recipesUtils.getRecipesTags(RecipeTags, opts, sendRecipeTags);

  function sendRecipeTags(err, tags) {
    res.send(JSON.stringify(tags));
  }
};
