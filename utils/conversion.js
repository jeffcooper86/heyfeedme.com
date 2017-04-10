var fractions = require('./fractions');
var measurements = require('./conversion-measurements');
var math = require('mathjs');

module.exports.convert = convert;
module.exports.convertFormatted = convertFormatted;

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

function convertFormatted(opts) {
  const res = convert(opts);
  var fData = {};
  fData.amount = opts.amount;
  fData.adjustment = opts.adjustment;
  fData.from = opts.from;
  fData.to = opts.to;
  fData.res = res;
  fData.fromUnit = measurements.getUnit(opts.from);
  fData.toUnit = measurements.getUnit(opts.to);
  const formatted = _format(fData);
  return {
    raw: res,
    formatted: formatted
  };
}

function _format(data) {
  var fr = {};
  if (data.res) {
    fr.fromAmt = data.amount;
    fr.fromUnit = measurements.getUnitShortName(data.fromUnit);
    fr.fromUnitFull = '';
    fr.toAmt = data.res.val.mixed || data.res.val.fraction;
    fr.toUnit = data.toUnit.name.abrv ? data.toUnit.name.abrv : data.res.val.int > 1 ? data.toUnit.name.plural : data.toUnit.name.full;
    fr.toUnitFull = data.res.val.int > 1 ? data.toUnit.name.plural : data.toUnit.name.full;
  }

  return fr;
}
