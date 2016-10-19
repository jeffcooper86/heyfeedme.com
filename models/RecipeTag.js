var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeTagSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

recipeTagSchema.virtual('defaultName').get(function() {
  return this.name;
});

module.exports.model = mongoose.model('RecipeTag', recipeTagSchema);

module.exports.adminModelDefaults = 'name'.split(' ');
module.exports.adminModelTable = 'name'.split(' ');
