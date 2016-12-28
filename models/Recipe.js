var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recipeUtils = require(process.cwd() + '/utils/recipes');
var cloudinaryUtils = require(process.cwd() + '/utils/cloudinary');

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
    type: String
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
    type: String
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

servingsSchema.virtual('servingSize').get(function() {
  var qty = this.qty,
    m = this.measurement;

  if (!qty && !m) return;
  return `${qty} ${m}`;
});

var stepsSchema = new Schema({
  text: {
    type: String,
    longText: true,
    maxlength: 300
  },
  photo: {
    type: String,
    file: 'image',
    note: 'Ratio should be 3:1'
  }
});

stepsSchema.virtual('photoOptimized').get(function() {
  return cloudinaryUtils.optimized(this.photo);
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
    file: 'image',
    cdn: 'cloudinary'
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
  steps: [stepsSchema],
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

recipeSchema.virtual('absoluteLink').get(function() {
  return '//heyfeedme.com' + recipeUtils.getRecipeLink(this);
});

recipeSchema.virtual('defaultName').get(function() {
  return this.name;
});

recipeSchema.virtual('link').get(function() {
  return recipeUtils.getRecipeLink(this);
});

recipeSchema.virtual('photoOptimized').get(function() {
  return cloudinaryUtils.optimized(this.photo);
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
