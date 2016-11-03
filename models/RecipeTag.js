var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeTagSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  seoTitle: {
    type: String,
    longText: true,
    maxLength: 60,
    note: 'The browser tab title.'
  },
  seoDescription: {
    type: String,
    longText: true,
    maxLength: 140,
    note: 'The description meta tag.'
  }
});

recipeTagSchema.virtual('defaultName').get(function() {
  return this.name;
});

module.exports.model = mongoose.model('RecipeTag', recipeTagSchema);

module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name'.split(' ');
