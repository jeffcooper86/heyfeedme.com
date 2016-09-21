var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeUtils = require(process.cwd() + '/utils/recipes');

var categories = recipeUtils.getCategories();
var classifications = recipeUtils.getClassifications();

var recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [{
    type: String,
    enum: categories
  }],
  classifications: [{
    type: String,
    enum: classifications
  }],

  // To do: reference other recipe as ingredients
  ingredients: [{
    type: String
  }],
  steps: [{
    type: String
  }],
  shortDescription: String,
  uploaded: {
    type: Date,
    default: Date.now,
    fixed: true
  }
});

module.exports.model = mongoose.model('Recipe', recipeSchema);

// For model/collection view.
module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name categories shortDescription uploaded'.split(' ');

// For queries.
module.exports.adminModelSelect = '';
module.exports.adminModelSort = {
  name: 1
};
