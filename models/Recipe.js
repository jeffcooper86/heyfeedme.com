var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeUtils = require(process.cwd() + '/utils/recipes');

var categories = recipeUtils.getCategories();

var recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [{
    type: String,
    enum: categories
  }],

  // To do: reference other recipe as ingredients
  ingredients: [{
    type: String
  }],
  steps: [{
    type: String
  }],
  description: String,
  uploaded: {
    type: Date,
    default: Date.now
  }
});

module.exports.model = mongoose.model('Recipe', recipeSchema);

module.exports.adminModelDefaults = 'name location categories'.split(' ');
module.exports.adminModelSelect = '';
module.exports.adminModelSort = {
  name: 1
};
