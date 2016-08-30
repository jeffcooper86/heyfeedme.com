var _ = require('lodash');

module.exports.getCategories = _getCategories;
module.exports.getClassifications = _getClassifications;

function _getCategories() {
  return 'breakfast:snacks:bread:pasta:sandwiches:main dishes:sides:salads:soups:dips:sauces:drinks:dessert'
    .split(':').sort();
}

function _getClassifications() {
  return 'vegetarian:vegan:gluten free'.split(':').sort();
}
