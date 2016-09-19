var utils = require(process.cwd() + '/utils/global');
var _ = require('lodash');

module.exports.getActiveCategories = getActiveCategories;
module.exports.getCategories = getCategories;
module.exports.getClassifications = getClassifications;
module.exports.getRecipes = getRecipes;
module.exports.searchRecipes = searchRecipes;
module.exports.setActiveCategories = setActiveCategories;

function getActiveCategories(req) {

  // First check request for params and fall back to cookies.
  var activeCats = _getActiveCategoriesFromUrl(req) ||
    req.cookies.sections;

  if (typeof(activeCats) === 'string') {
    activeCats = JSON.parse(activeCats);
  }

  // Default to All.
  if (!activeCats || !activeCats.length) activeCats = ['all'];

  return activeCats;
}

function getCategories() {
  return 'breakfast;snacks;bread;pasta;sandwiches;main dishes;sides;salads;soups;dips;sauces;drinks;dessert'
    .split(';').sort();
}

function getClassifications() {
  return 'vegetarian;vegan;gluten free'.split(';').sort();
}

function getRecipes(Recipes, cats, cb) {
  var q;
  if (cats && cats.indexOf('all') < 0) {
    q = Recipes.model.find()
      .where('categories').in(cats);
  } else q = Recipes.model.find();
  q.exec(function(err, recipes) {
    cb(err, recipes);
  });
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

function _getActiveCategoriesFromUrl(req) {

  // To do: Restrict to valid categories
  return req.query.sections &&
    utils.i.unslugify(req.query.sections.toLowerCase()).split(',');
}
