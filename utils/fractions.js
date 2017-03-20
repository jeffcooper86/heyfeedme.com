var math = require('mathjs');

module.exports.allPossibleFractions = allPossibleFractions;
module.exports.closestFraction = closestFraction;
module.exports.fractionAndInt = fractionAndInt;
module.exports.isStandardFraction = isStandardFraction;
module.exports.mixedNumber = mixedNumber;

// If 1/4, also adds 2/4, 3/4
function allPossibleFractions(fractions) {
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

function closestFraction(num, fractions) {
  var closest = [],
    difference,
    numFrac,
    numInt,
    numMixed = mixedNumber(num).split(' '),
    result;

  if (isStandardFraction(math.number(num), fractions)) return;
  fractions = fractions || [];

  // Need to consider 0 and 1 as well.
  if (fractions[0] !== 0) fractions.unshift(0);
  if (fractions[1] !== 1) fractions.push(1);

  fractions = allPossibleFractions(fractions);
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
    result.vals.push(fractionAndInt(
      math.add(math.number(numInt), math.fraction(c))
    ));
  });

  return result;
}

function fractionAndInt(val) {
  var r = {};
  r.fraction = val.toFraction();
  r.int = math.round(math.number(val), 3);
  if (val.n > val.d) {
    r.mixed = mixedNumber(val);
  }
  return r;
}

function isStandardFraction(num, standards) {
  var fraction = math.fraction(num);

  // Consider integers to be standard.
  if (Number.isInteger(num)) return true;

  // If no standards, can't be standard.
  if (!standards) return false;

  // Check for matching denominators.
  return standards.some(function(s) {
    var sd = Number(s.split('/')[1]);
    return sd === fraction.d;
  });
}

function mixedNumber(val) {
  var n,
    f;

  if (!val.n || !val.d) val = math.fraction(val);
  n = Math.floor(val.n / val.d);
  f = math.fraction((val.n - (n * val.d)) / val.d);
  if (math.number(f) === 0) return `${n}`;
  else return `${n} ${f.toFraction()}`;
};
