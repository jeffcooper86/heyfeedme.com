var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/recipeSection',
    recipeSection = req.params.recipeSection;

  l.crumbs = [
    ['recipes', '/recipes'],
    [utils.unslugify(recipeSection)]
  ];
  res.render(template);
};
