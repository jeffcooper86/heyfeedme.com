var cUtils = require(process.cwd() + '/utils/conversion');

exports = module.exports = function(req, res, next) {
  var l = res.locals;
  l.title = 'Recipe conversions';
  l.ratios = cUtils.americanStandard;
  if (req.method === 'POST') doConversion();
  return res.render('tools/conversions.pug');

  function doConversion() {
    var opts = {
        amount: req.body.amount,
        adjustment: req.body.adjustment,
        from: req.body.from,
        to: req.body.to
      },
      result = cUtils.convert(opts);
    l.data.amount = opts.amount;
    l.data.adjustment = opts.adjustment;
    l.data.from = opts.from;
    l.data.to = opts.to;
    l.data.result = result;
    l.data.fromUnit = cUtils.getUnit(opts.from);
    l.data.toUnit = cUtils.getUnit(opts.to);
    if (!result) return;
    l.data.formattedResult = formatResult(l.data);
  }
};

function formatResult(data) {
  var fr = {};
  fr.fromAmt = data.amount;
  fr.fromUnit = cUtils.getShortName(data.fromUnit);
  fr.fromUnitFull = '';
  fr.toAmt = data.result.mixed || data.result.fraction;
  fr.toUnit = data.toUnit.name.abrv ? data.toUnit.name.abrv : data.result > 1 ? data.toUnit.name.plural : data.toUnit.name.full;
  fr.toUnitFull = data.result.int > 1 ? data.toUnit.name.plural : data.toUnit.name.full;
  return fr;
}
