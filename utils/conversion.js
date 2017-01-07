var math = require('mathjs');

/**
 * Measurements
 */

const fractions = '1/8 1/4 1/3 1/2'.split(' ');

// Metric
const ml = {
  name: {
    abrv: 'ml',
    full: 'milliliter',
    plural: 'milliliters'
  },
  type: 'm',
  tsp: 5,
  liter: 1000
};

const liter = {
  name: {
    abrv: 'l',
    full: 'liter',
    plural: 'liters'
  },
  type: 'm',
  equivalent: quart
};


// American Standard
const dash = {
  name: {
    full: 'dash',
    plural: 'dashes'
  },
  ratios: {
    pinch: 2
  },
  rank: 1
};

const pinch = {
  name: {
    full: 'pinch',
    plural: 'pinches'
  },
  ratios: {
    teaspoon: 8
  },
  rank: 2
};

const tsp = {
  name: {
    abrv: 'tsp',
    full: 'teaspoon',
    plural: 'teaspoons'
  },
  ratios: {
    tablespoon: 3
  },
  rank: 3,
  standards: fractions
};

const tbsp = {
  name: {
    abrv: 'tbsp',
    full: 'tablespoon',
    plural: 'tablespoons'
  },
  ratios: {
    ounce: 2
  },
  rank: 4,
  standards: fractions.slice(1)
};

const oz = {
  name: {
    abrv: 'oz',
    full: 'ounce',
    plural: 'ounces'
  },
  ratios: {
    cup: 8
  },
  rank: 5
};

const cup = {
  name: {
    full: 'cup',
    plural: 'cups'
  },
  ratios: {
    pint: 2
  },
  rank: 6,
  standards: fractions.slice(1)
};

const pint = {
  name: {
    abrv: 'pt',
    full: 'pint',
    plural: 'pints'
  },
  ratios: {
    quart: 2
  },
  rank: 7,
  standards: fractions.slice(1)
};

const quart = {
  name: {
    abrv: 'qt',
    full: 'quart',
    plural: 'quarts'
  },
  ratios: {
    gallon: 4
  },
  equivalent: 'liter',
  rank: 8,
  standards: fractions.slice(1)
};

const gallon = {
  name: {
    abrv: 'gal',
    full: 'gallon',
    plural: 'gallons'
  },
  ratios: {},
  rank: 9,
  standards: fractions.slice(1)
};

const americanStandard = [dash, pinch, tsp, tbsp, oz, cup, pint, quart, gallon];
addRatios(americanStandard);

module.exports.convert = convert;
module.exports.americanStandard = americanStandard;
module.exports.getShortName = getShortName;
module.exports.getUnit = getUnit;

function addRatios(measurements) {
  measurements.map(function(r, i) {
    var factor = 1;
    measurements.forEach(function(rr, ii) {
      var name = measurements[ii].name.full;
      if (ii > i) {
        factor = factor * measurements[ii - 1].ratios[rr.name.full];
        r.ratios[name] = factor;
      } else if (ii !== i && measurements[ii]) {
        r.ratios[name] = `1/${measurements[ii].ratios[r.name.full]}`;
      }
    });
    return r;
  });
  return measurements;
}

function convert(opts) {
  var amount = opts.amount,
    adjustment = math.fraction(opts.adjustment || 1),
    fromU = opts.from,
    toU = opts.to,
    val,
    ratios = americanStandard;

  if (!amount || !fromU || !toU) return;

  amount = math.fraction(opts.amount);
  val = math.multiply(amount, adjustment);
  if (fromU !== toU) {
    ratios.forEach(function(r) {
      var toNum;
      if (r.name.full === toU) {
        toNum = math.fraction(r.ratios[fromU]);
        val = math.multiply(toNum, val);
      }
    });
  }
  _fractionStandard(math.number(val), getUnit(fromU));
  return _fractionAndInt(val);
}

function getShortName(unit) {
  return unit.name.abrv ? unit.name.abrv : unit.name.full;
}

function getUnit(opts) {
  var optKey = opts.name || opts.abrv || opts,
    unit;
  americanStandard.forEach(function(u) {
    if (optKey === u.name.full || optKey === u.name.abrv) unit = u;
  });
  return unit;
}

// Need to consider 0 and 1 as well.
function _closestFraction(num, fractions) {
  var closest = [],
    difference,
    numFrac;

  var numMixed = _mixedNumber(num).split(' ');

  numFrac = numMixed.length === 2 ? numMixed[1] : numMixed[0];
  numFrac = math.number(math.fraction(numFrac));

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

  return {
    closest: {
      val: closest,
      diff: difference
    }
  };
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

function _fractionStandard(num, unit) {
  var standards = unit.standards,
    allStandards = [],
    fraction = math.fraction(num),
    isStandard = false,
    closestFraction;

  if (!_isFraction(num)) return;

  standards.forEach(function(s) {

    // Check if fraction is already standard.
    var sd = Number(s.split('/')[1]);
    if (sd === fraction.d) isStandard = true;

    // Build all possible standard fractions.
    for (var i = 1; i < sd; i++) {
      if (sd === 2 || sd / i !== 2) allStandards.push(`${i}/${sd}`);
    }
  });

  if (isStandard) return fraction;

  // console.log(num, unit, standards);
  closestFraction = _closestFraction(num, allStandards);
  console.log(closestFraction);
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
