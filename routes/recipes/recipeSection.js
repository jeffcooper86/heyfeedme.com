var async = require('async');
var Recipes = require(process.cwd() + '/models/Recipe');
var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipeSection',
    recipeSections = req.query.sections && utils.unslugify(req.query.sections)
    .split(','),
    recipesQuery;

  l.data.sections = recipeSections || 'all sections';

  if (recipeSections) {
    recipesQuery = Recipes.model.find()
      .where('categories').in(recipeSections);
  } else {
    recipesQuery = Recipes.model.find();
  }

  async.waterfall([
    getAll
  ], function(err) {
    return res.render(template);
  });

  function getAll(cb) {
    recipesQuery.exec(function(err, data) {
      l.data.recipes = data;
      cb(null);
    });
  }
};
