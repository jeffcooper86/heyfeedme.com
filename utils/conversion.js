var _ = require('lodash');

var fractions = require('./fractions');
var measurements = require('./conversion-measurements');
var math = require('mathjs');

module.exports.convert = convert;
module.exports.americanStandard = measurements.americanStandard;
module.exports.getUnitShortName = getUnitShortName;
module.exports.getUnit = getUnit;

function convert(opts) {
  var amount = opts.amount,
    adjustment = math.fraction(opts.adjustment || 1),
    fromU = opts.from,
    toU = opts.to,
    val,
    ratios = measurements.americanStandard,
    unit = getUnit(toU),
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

function getUnit(opts) {
  var optKey = opts.name || opts.abrv || opts,
    unit;
  measurements.americanStandard.forEach(function(u) {
    if (optKey === u.name.full || optKey === u.name.abrv) unit = u;
  });
  return _.cloneDeep(unit);
}

function getUnitShortName(unit) {
  return unit.name.abrv ? unit.name.abrv : unit.name.full;
}
