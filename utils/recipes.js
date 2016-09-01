var _ = require('lodash');

module.exports.getActiveCategories = getActiveCategories;
module.exports.getCategories = getCategories;
module.exports.getClassifications = getClassifications;
module.exports.setActiveCategories = setActiveCategories;

function getActiveCategories(req) {

  // First check request for params and fall back to cookies.
  var activeCats = _getActiveCategoriesFromUrl(req) ||
    req.cookies.activeCategories;

  // Default to All.
  return activeCats || ['all recipes'];
}

function getCategories() {
  return 'breakfast;snacks;bread;pasta;sandwiches;main dishes;sides;salads;soups;dips;sauces;drinks;dessert'
    .split(';').sort();
}

function getClassifications() {
  return 'vegetarian;vegan;gluten free'.split(';').sort();
}

function setActiveCategories(res, cats) {
  res.cookie('activeCategories', cats);
}

function _getActiveCategoriesFromUrl(req) {

  // To do: Restrict to valid categories

  return req.query.sections &&
  utils.unslugify(req.query.sections.toLowerCase()).split(',');
}
