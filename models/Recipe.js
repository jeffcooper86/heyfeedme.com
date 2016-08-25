var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categories = 'abstract city fine-art flowers human-interest landscape macro minimalist nature people portrait still-life'.split(' ');

var recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [{
    type: String,
    enum: categories
  }],
  filename: String,
  date: Date,
  location: String,
  description: String,
  size: {
    orientation: String,
    height: Number,
    width: Number
  },
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
