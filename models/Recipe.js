var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeUtils = require(process.cwd() + '/utils/recipes');

var categories = recipeUtils.getCategories();
var classifications = recipeUtils.getClassifications();

var ingredientSchema = new Schema({
  qty: {
    type: Number
  },
  measurement: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }
});

var recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  categories: [{
    type: String,
    enum: categories
  }],
  classifications: [{
    type: String,
    enum: classifications
  }],
  ingredients: [ingredientSchema],
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

// For admin model/collection views.
module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name categories shortDescription uploaded'.split(' ');

// For admin model view queries.
module.exports.adminModelSelect = '';
module.exports.adminModelSort = {
  name: 1
};
