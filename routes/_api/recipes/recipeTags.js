var RecipeTags = require(process.cwd() + '/models/RecipeTag');
var recipesUtils = require(process.cwd() + '/utils/recipes');
var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var skip = utils.i.getNested(req, 'query.skip'),
    opts;

  skip = skip ? JSON.parse(skip) : null;
  if (skip) {
    skip = skip.filter(function(id) {
      return id.length;
    });
  }

  opts = {
    skip: skip
  };

  recipesUtils.getRecipesTags(RecipeTags, opts, addDefaultName);

  function addDefaultName(err, tags) {
    var newTags = tags.map(function(t) {
      var newT = t.toObject();
      newT.defaultName = t.defaultName;
      return newT;
    });
    sendRecipeTags(newTags);
  }

  function sendRecipeTags(tags) {
    res.send(JSON.stringify(tags));
  }
};
