var _ = require('lodash');

module.exports.getCategories = _getCategories;

function _getCategories() {
  return 'breakfast:snacks:bread:pasta:sandwiches:main dishes:sides:salads:soups:dips:sauces:drinks:dessert'
    .split(':').sort();
}
