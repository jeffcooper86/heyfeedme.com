var conversion = require(process.cwd() + '/utils/conversion');

exports = module.exports = function(req, res, next) {
  var l = res.locals;
  l.ratios = conversion.americanStandard;
  return res.render('tools/conversions.pug');
};
