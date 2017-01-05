var math = require('mathjs');

/**
 * Measurements
 */

const eighth = 1 / 8,
  fractions = [1 / 8, 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1];

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
  standards: fractions.unshift(eighth)
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
  rank: 4
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
  standards: fractions
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
  rank: 7
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
  rank: 8
};

const gallon = {
  name: {
    abrv: 'gal',
    full: 'gallon',
    plural: 'gallons'
  },
  ratios: {},
  rank: 9
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

function _fractionAndInt(val) {
  var r = {};
  r.fraction = val.toFraction();
  r.int = math.round(math.number(val), 3);
  if (val.n > val.d) {
    r.mixed = _mixedNumber(val);
  }
  return r;
}

function _mixedNumber(val) {
  var n,
    f;
  n = Math.floor(val.n / val.d);
  f = math.fraction((val.n - (n * val.d)) / val.d);
  if (math.number(f) === 0) return n;
  else return `${n} ${f.toFraction()}`;
};
