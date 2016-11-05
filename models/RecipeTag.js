var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require(process.cwd() + '/utils/global');

var recipeTagSchema = new Schema({
  name: {
    type: String,
    required: true,
    note: 'Tag names are capitalized and joined when displayed.'
  },
  seoTitle: {
    type: String,
    longText: true,
    maxlength: 60,
    note: 'The browser tab title.'
  },
  seoDescription: {
    type: String,
    longText: true,
    maxlength: 140,
    note: 'The description meta tag.'
  }
});

recipeTagSchema.virtual('defaultName').get(function() {
  return utils.capitalizeTitles(this.name).replace(' ', '');
});

module.exports.model = mongoose.model('RecipeTag', recipeTagSchema);

module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name'.split(' ');
