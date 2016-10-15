var fs = require('fs');
var globalUtils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res, next) {
  var l = res.locals;

  l.title = 'Styles';
  l.componentsLinks = buildLinks(fs.readdirSync('./views/_style/components'));
  l.foundationLinks = buildLinks(fs.readdirSync('./views/_style/foundation'));

  res.render('_style/_style.pug');

  function buildLinks(files) {
    return files.map(function(f) {
      return globalUtils.i.stripFileExtension(f);
    });
  }
};
