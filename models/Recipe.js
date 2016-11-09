var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeUtils = require(process.cwd() + '/utils/recipes');

var categories = recipeUtils.getCategories();
var classifications = recipeUtils.getClassifications();

var ingredientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  qty: {
    type: Number
  },
  measurement: {
    type: String
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }
});

ingredientSchema.virtual('amount').get(function() {
  var qty = this.qty,
    measurement = this.measurement,
    a;
  if (!(qty || measurement)) return '';
  a = ': ';
  a = a + (qty ? ` ${qty}` : '');
  a = a + (measurement ? ` ${measurement}` : '');
  return a;
});

ingredientSchema.virtual('defaultName').get(function() {
  return this.name;
});

ingredientSchema.virtual('text').get(function() {
  var name = this.name,
    type = this.type,
    t;
  t = `${name}`;
  t = t + (type ? `, ${type}` : '');
  return t;
});

var servingsSchema = new Schema({
  qty: {
    type: Number
  },
  measurement: {
    type: String,
    maxlength: 40
  },
  servings: {
    type: Number,
    note: 'Number of servings.'
  }
});

var recipeSchema = new Schema({
  publish: {
    type: Boolean
  },
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  photo: {
    type: String,
    file: 'image'
  },
  summary: {
    type: String,
    longText: true,
    maxlength: 140
  },
  servings: {
    type: servingsSchema
  },
  seoDescription: {
    type: String,
    longText: true,
    maxlength: 140
  },
  categories: [{
    type: String,
    enum: categories
  }],
  classifications: [{
    type: String,
    enum: classifications
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipeTag',
    unique: true
  }],
  ingredients: [ingredientSchema],
  steps: [{
    type: String,
    longText: true,
    maxlength: 140
  }],
  notes: {
    type: String,
    longText: true,
    maxlength: 300
  },
  uploaded: {
    type: Date,
    default: Date.now,
    fixed: true
  },
  published: {
    type: Date,
    fixed: true,
    dependent: true
  },
  updated: {
    type: Date,
    fixed: true,
    current: true
  }
});

recipeSchema.virtual('defaultName').get(function() {
  return this.name;
});

recipeSchema.virtual('link').get(function() {
  return recipeUtils.getRecipeLink(this);
});

module.exports.model = mongoose.model('Recipe', recipeSchema);

// For admin model/collection views.
module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name categories summary published updated'.split(' ');

// For admin model view queries.
module.exports.adminModelSelect = '';
module.exports.adminModelSort = {
  name: 1
};
