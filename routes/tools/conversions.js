var conversionUtils = require(process.cwd() + '/utils/conversion');

exports = module.exports = function(req, res, next) {
  var l = res.locals;
  l.title = 'Recipe conversions';
  l.ratios = conversionUtils.americanStandard;
  if (req.method === 'POST') doConversion();
  return res.render('tools/conversions.pug');

  function doConversion() {
    var opts = {
        amount: req.body.amount,
        adjustment: req.body.adjustment,
        from: req.body.from,
        to: req.body.to
      },
      result = conversionUtils.convert(opts);
    l.data.amount = opts.amount;
    l.data.adjustment = opts.adjustment;
    l.data.from = opts.from;
    l.data.to = opts.to;
    l.data.result = result;
  }
};
