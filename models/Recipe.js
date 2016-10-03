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

ingredientSchema.virtual('text').get(function() {
  var name = this.name,
    type = this.type,
    t;
  t = `${name}`;
  t = t + (type ? `, ${type}` : '');
  return t;
});

var recipeSchema = new Schema({
  published: {
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
  ingredients: [ingredientSchema],
  steps: [{
    type: String,
    longText: true,
    maxlength: 140
  }],
  uploaded: {
    type: Date,
    default: Date.now,
    fixed: true
  },
  updated: {
    type: Date,
    fixed: true,
    current: true
  }
});

module.exports.model = mongoose.model('Recipe', recipeSchema);

// For admin model/collection views.
module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name categories summary updated published'.split(' ');

// For admin model view queries.
module.exports.adminModelSelect = '';
module.exports.adminModelSort = {
  name: 1
};
