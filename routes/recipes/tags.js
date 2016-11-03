const async = require('async');

const RecipeTags = require(process.cwd() + '/models/RecipeTag');
const recipesUtils = require(process.cwd() + '/utils/recipes');
const utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/tags',
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    searchQ = req.query.search;

  l.data.search = searchQ;
  l.activeSections = activeSections;
  l.title = 'Recipe tags - heyfeedme.';

  recipesUtils.setActiveCategories(res, activeSections);
  recipesUtils.setActiveClasses(res, activeClasses);

  async.waterfall([
    getTags
  ], function(err, tags) {
    if (err) {
      console.log(err);
      return res.render('_error500');
    }
    l.data.tags = sortTags(tags);
    res.render(template);
  });

  function getTags(cb) {
    recipesUtils.getRecipesTags(RecipeTags, {}, cb);
  }

  function sortTags(tags) {
    return utils.i.sortOn({
      arr: tags,
      val: 'name'
    });
  }
};
