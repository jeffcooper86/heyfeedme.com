var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeTagSchema = new Schema({
  tag: {
    type: String,
    required: true
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
});

module.exports.model = mongoose.model('RecipeTag', recipeTagSchema);

module.exports.adminModelDefaults = 'tag'.split(' ');
module.exports.adminModelTable = 'tag recipes'.split(' ');
