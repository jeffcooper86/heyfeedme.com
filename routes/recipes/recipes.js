const async = require('async');

const Recipes = require(process.cwd() + '/models/Recipe');
const RecipeTags = require(process.cwd() + '/models/RecipeTag');
const recipesUtils = require(process.cwd() + '/utils/recipes');
const utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipes',
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    searchQ = req.query.search,
    sort = req.query.sort || req.cookies.recipesListingsSort,
    tagName = utils.i.unslugify(req.params.tag),
    tagId = req.params.tagId;

  // Set locals.
  l.data.search = searchQ;
  l.data.sort = sort;
  l.data.sortOptions = recipesUtils.getSortOptions();
  l.activeSections = activeSections;

  // Reset the cookies because the user may have edited them from the url.
  recipesUtils.setActiveCategories(res, activeSections);
  recipesUtils.setActiveClasses(res, activeClasses);
  recipesUtils.setSort(res, sort);

  async.waterfall([
    getTag,
    getAll,
    search
  ], function(err, data) {
    if (err) {
      console.log(err);
      return res.render('_error500');
    }
    l.data.recipes.recipes = data;
    return res.render(template);
  });

  function getAll(tag, cb) {

    // Tag does not exist.
    if (tagId && !tag) return res.redirect('/recipes/tags');

    // Tag name is incorrect.
    else if (tag && tag.defaultName !== tagName) {
      return res.redirect(
        req.url.replace(
          utils.i.slugify(tagName), utils.i.slugify(tag.defaultName)
        )
      );
    }

    // Tag settings.
    if (tag) {
      l.data.tag = tag.defaultName;
      l.crumbs = [
        ['tags', '/recipes/tags'],
        [tag.defaultName]
      ];
      l.title = tag.seoTitle || `${utils.capitalizeFirst(tag.defaultName)} - heyfeedme.`;
    }

    var filters = {
        activeSections: activeSections,
        activeClasses: activeClasses
      },
      opts = {
        filters: filters,
        sort: sort,
        tag: tagId
      };
    recipesUtils.getRecipes(Recipes, opts, cb);
  }

  function getTag(cb) {
    if (tagId) recipesUtils.getRecipesTag(RecipeTags, tagId, cb);
    else cb(null, null);
  }

  function search(recipes, cb) {
    cb(null, recipesUtils.searchRecipes(recipes, searchQ));
  }
};
