var utils = require(process.cwd() + '/utils/global');
var _ = require('lodash');

module.exports.getActiveCategories = getActiveCategories;
module.exports.getActiveClassifications = getActiveClassifications;
module.exports.getActiveFilters = getActiveFilters;
module.exports.getCategories = getCategories;
module.exports.getClassifications = getClassifications;
module.exports.getRecipes = getRecipes;
module.exports.getRecipesTags = getRecipesTags;
module.exports.getSortOptions = getSortOptions;
module.exports.searchRecipes = searchRecipes;
module.exports.setActiveCategories = setActiveCategories;
module.exports.setActiveClasses = setActiveClasses;
module.exports.setSort = setSort;

function getActiveFilters(req, filter) {

  // First check request for params and fall back to cookies.
  var actives = _getFiltersFromUrl(req, filter) ||
    utils.i.getNested(req, `cookies.${filter}`);

  if (typeof(actives) === 'string') {
    actives = JSON.parse(actives);
  }

  // Default to All.
  if (!actives ||
    !actives.length ||
    (actives.length === 1 && !actives[0])
  ) actives = ['all'];

  return actives;
}

function getActiveCategories(req) {
  return getActiveFilters(req, 'sections');
}

function getActiveClassifications(req) {
  return getActiveFilters(req, 'diets');
}

function getCategories() {
  return 'breakfast;lunch;dinner;carbs;pasta;sandwiches;meat;main dishes;sides;salads;soups;stews;dips;sauces;dressings;drinks;dessert'
    .split(';').sort();
}

function getClassifications() {
  return 'vegetarian;vegan;gluten free'.split(';').sort();
}

function getRecipes(Recipes, opts, cb) {
  var q = Recipes.model.find()
    .where('publish').equals(true),
    cats = opts.filters.activeSections,
    classes = opts.filters.activeClasses,
    sort = opts.sort,
    tag = opts.tag;

  if (cats && cats.indexOf('all') < 0) q.where('categories').in(cats);
  if (classes && classes.indexOf('all') < 0) {
    q.where('classifications').in(classes);
  }
  if (tag.length) q.where('tags').in([tag]);

  switch (sort) {
    case 'new':
      q.sort({
        published: -1
      });
      break;
    case 'old':
      q.sort('published');
      break;
    case 'az':
      q.sort('name');
      break;
    case 'za':
      q.sort({
        name: -1
      });
      break;
    default:
      q.sort({
        published: -1
      });
  }
  q.exec(function(err, recipes) {
    cb(err, recipes);
  });
}

function getRecipesTags(RecipeTags, opts, cb) {
  var q = RecipeTags.model.find();
  q.exec(function(err, tags) {
    cb(err, tags);
  });
}

function getSortOptions() {
  return {
    new: 'new',
    old: 'old',
    az: 'az',
    za: 'za'
  };
}


function searchRecipes(recipes, q) {
  if (!q) return recipes;
  var searchOn = [
    'name',
    'categories',
    'classifications',
    'ingredients',
    'shortDescription'
  ];

  q = q.toLowerCase();
  recipes = _.filter(recipes, function(recipe) {
    var includeRecipe = false;
    searchOn.forEach(function(searchItem) {
      var recipeItem = recipe[searchItem];
      if (!recipeItem) return;

      // Format recipe items as strings.
      if (Array.isArray(recipeItem)) recipeItem = recipeItem.join(' ');
      recipeItem = recipeItem.toLowerCase();

      // Look for a match.
      var sRe = new RegExp(`${q}`);
      if (recipeItem.search(sRe) > -1) includeRecipe = true;
    });
    return includeRecipe;
  });
  return recipes;
}

function setActiveCategories(res, cats) {
  res.cookie('sections', cats);
}

function setActiveClasses(res, classes) {
  res.cookie('diets', classes);
}

function setSort(res, sort) {
  res.cookie('recipesListingsSort', sort);
}

function _getFiltersFromUrl(req, param) {

  // To do: Restrict to valid categories
  return req.query[param] &&
    utils.i.unslugify(
      utils.i.getNested(req, `query.${param}`)
    ).toLowerCase().split(',');
}
