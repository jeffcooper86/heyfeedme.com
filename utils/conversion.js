var utils = require(process.cwd() + '/utils/global');

/**
 * Measurements
 */

const eighth = 1 / 8,
  fractions = [1 / 8, 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1];

// Metric
const ml = {
  name: {
    abrv: 'ml',
    full: 'milliliter'
  },
  type: 'm',
  tsp: 5,
  liter: 1000
};

const liter = {
  name: {
    abrv: 'l',
    full: 'liter'
  },
  type: 'm',
  equivalent: quart
};


// American Standard
const dash = {
  name: {
    full: 'dash'
  },
  ratios: {
    pinch: 2
  },
  rank: 1
};

const pinch = {
  name: {
    full: 'pinch'
  },
  ratios: {
    teaspoon: 8
  },
  rank: 2
};

const tsp = {
  name: {
    abrv: 'tsp',
    full: 'teaspoon'
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
    full: 'tablespoon'
  },
  ratios: {
    ounce: 2
  },
  rank: 4
};

const oz = {
  name: {
    abrv: 'oz',
    full: 'ounce'
  },
  ratios: {
    cup: 8
  },
  rank: 5
};

const cup = {
  name: {
    full: 'cup'
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
    full: 'pint'
  },
  ratios: {
    quart: 2
  },
  rank: 7
};

const quart = {
  name: {
    abrv: 'qt',
    full: 'quart'
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
    full: 'gallon'
  },
  ratios: {},
  rank: 9
};

const americanStandard = [dash, pinch, tsp, tbsp, oz, cup, pint, quart, gallon];
addRatios(americanStandard);

module.exports.convert = convert;
module.exports.americanStandard = americanStandard;

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
  var amount = utils.fractionToInt(opts.amount),
    adjustment = utils.fractionToInt(opts.adjustment) || 1,
    fromU = opts.from,
    toU = opts.to,
    result,
    ratios = americanStandard;

  if (!amount || !fromU || !toU) return 'NAN';
  result = amount * adjustment;
  if (fromU !== toU) {
    ratios.forEach(function(r) {
      var toNum;
      if (r.name.full === toU) {
        toNum = utils.fractionToInt(r.ratios[fromU]);
        result = result * toNum;
      }
    });
  }
  return result;
}
