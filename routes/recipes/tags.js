var recipesUtils = require(process.cwd() + '/utils/recipes');

exports = module.exports = function(req, res) {
  var l = res.locals,
    template = 'recipes/tags',
    activeSections = res.locals.data.recipes.activeCats,
    activeClasses = res.locals.data.recipes.activeClasses,
    searchQ = req.query.search;

  l.data.search = searchQ;
  l.activeSections = activeSections;

  recipesUtils.setActiveCategories(res, activeSections);
  recipesUtils.setActiveClasses(res, activeClasses);

  res.render(template);
};
