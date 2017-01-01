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
  pinch: 2,
  tsp: 16,
  rank: 1
};

const pinch = {
  name: {
    full: 'pinch'
  },
  tsp: 8,
  rank: 2
};

const tsp = {
  name: {
    abrv: 'tsp',
    full: 'teaspoon'
  },
  tbsp: 3,
  rank: 3,
  standards: fractions.unshift(eighth)
};

const tbsp = {
  name: {
    abrv: 'tbsp',
    full: 'tablespoon'
  },
  oz: 2,
  rank: 4
};

const oz = {
  name: {
    abrv: 'oz',
    full: 'ounce'
  },
  cup: 8,
  rank: 5
};

const cup = {
  name: {
    full: 'cup'
  },
  pint: 2,
  rank: 6,
  standards: fractions
};

const pint = {
  name: {
    abrv: 'pt',
    full: 'pint'
  },
  quart: 2,
  oz: 16,
  rank: 7
};

const quart = {
  name: {
    abrv: 'qt',
    full: 'quart'
  },
  gallon: 4,
  equivalent: liter,
  rank: 8
};

const gallon = {
  name: {
    abrv: 'gal',
    full: 'gallon'
  },
  rank: 9
};

const americanStandard = [dash, pinch, tsp, tbsp, oz, cup, pint, quart, gallon];

module.exports.convert = convert;
module.exports.americanStandard = americanStandard;

function convert(opts) {
  var qty = opts.qty,
    measurement = opts.measurement;

  return qty + measurement;
}
