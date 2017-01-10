var fractions = require('./fractions');
var measurements = require('./conversion-measurements');
var math = require('mathjs');

module.exports.convert = convert;

function convert(opts) {
  var amount = opts.amount,
    adjustment = math.fraction(opts.adjustment || 1),
    fromU = opts.from,
    toU = opts.to,
    val,
    ratios = measurements.americanStandard,
    unit = measurements.getUnit(toU),
    result = {};

  if (!amount || !fromU || !toU || !unit) return;

  // Caculate adjustment.
  amount = math.fraction(opts.amount);
  val = math.multiply(amount, adjustment);

  // Convert by ratio.
  if (fromU !== toU) {
    ratios.forEach(function(r) {
      var toNum;
      if (r.name.full === toU) {
        toNum = math.fraction(r.ratios[fromU]);
        val = math.multiply(toNum, val);
      }
    });
  }

  // Calculate fractions.
  result.val = fractions.fractionAndInt(val);
  result.closestFraction = fractions.closestFraction(val, unit.standards);
  return result;
}
