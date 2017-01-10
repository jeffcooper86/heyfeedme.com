var _ = require('lodash');

var measurements = require('./conversion-measurements');
var math = require('mathjs');

module.exports.convert = convert;
module.exports.americanStandard = measurements.americanStandard;
module.exports.getShortName = getShortName;
module.exports.getUnit = getUnit;

function convert(opts) {
  var amount = opts.amount,
    adjustment = math.fraction(opts.adjustment || 1),
    fromU = opts.from,
    toU = opts.to,
    val,
    ratios = measurements.americanStandard,
    result = {};

  if (!amount || !fromU || !toU) return;

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
  result.val = _fractionAndInt(val);
  result.closestFraction = _closestFraction(val, getUnit(toU));
  return result;
}

function getShortName(unit) {
  return unit.name.abrv ? unit.name.abrv : unit.name.full;
}

function getUnit(opts) {
  var optKey = opts.name || opts.abrv || opts,
    unit;
  measurements.americanStandard.forEach(function(u) {
    if (optKey === u.name.full || optKey === u.name.abrv) unit = u;
  });
  return _.cloneDeep(unit);
}

function _allPossibleFractions(fractions) {
  return fractions.reduce(function(result, f) {
    if (f === 0 || f === 1) result.push(f);
    else {
      var sd = Number(f.split('/')[1]);
      for (var i = 1; i < sd; i++) {
        if (sd === 2 || sd / i !== 2) result.push(`${i}/${sd}`);
      }
    }
    return result;
  }, []);
}

function _closestFraction(num, fromU) {
  var closest = [],
    difference,
    fractions,
    numFrac,
    numInt,
    numMixed = _mixedNumber(num).split(' '),
    result;

  if (_isStandardFraction(math.number(num), fromU)) return;
  fractions = fromU.standards || [];

  // Need to consider 0 and 1 as well.
  if (fractions[0] !== 0) fractions.unshift(0);
  if (fractions[1] !== 1) fractions.push(1);

  fractions = _allPossibleFractions(fractions);
  numFrac = numMixed.length === 2 ? numMixed[1] : numMixed[0];
  numFrac = math.number(math.fraction(numFrac));
  numInt = numMixed.length === 2 ? numMixed[0] : 0;

  fractions.forEach(function(f) {
    var n = math.number(math.fraction(f));
    var diff = Math.abs(numFrac - n);

    if (!difference || diff < difference) {
      difference = diff;
      closest = [f];
    } else if (diff === difference) {
      closest.push(f);
    }
  });

  result = {
    vals: [],
    diff: math.round(difference, 4)
  };

  closest.forEach(function(c) {
    result.vals.push(_fractionAndInt(
      math.add(math.number(numInt), math.fraction(c))
    ));
  });

  return result;
}

function _fractionAndInt(val) {
  var r = {};
  r.fraction = val.toFraction();
  r.int = math.round(math.number(val), 3);
  if (val.n > val.d) {
    r.mixed = _mixedNumber(val);
  }
  return r;
}

function _isStandardFraction(num, unit) {
  var standards = unit.standards,
    fraction = math.fraction(num),
    isStandard = false;

  // Consider integers to be standard.
  if (!_isFraction(num)) return true;

  // If no standards, can't be standard.
  if (!standards) return false;

  // Check for matching denominators.
  standards.forEach(function(s) {
    var sd = Number(s.split('/')[1]);
    if (sd === fraction.d) isStandard = true;
  });

  return isStandard;
}

function _isFraction(num) {
  var fraction = math.fraction(num),
    n = Math.floor(fraction.n / fraction.d);
  return (fraction.n - (n * fraction.d)) / fraction.d !== 0;
}

function _mixedNumber(val) {
  var n,
    f;

  if (!val.n || !val.d) val = math.fraction(val);
  n = Math.floor(val.n / val.d);
  f = math.fraction((val.n - (n * val.d)) / val.d);
  if (math.number(f) === 0) return `${n}`;
  else return `${n} ${f.toFraction()}`;
};
