module.exports.convert = convert;
module.exports.americanStandard = americanStandard;

/**
 * Measurements
 */

const eighth = 1 / 8,
  fractions = [1 / 8, 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1];

// Metric
const ml = {
  type: 'm',
  tsp: 5,
  liter: 1000
};

const liter = {
  type: 'm',
  equivalent: quart
};


// American Standard
const dash = {
  pinch: 2,
  tsp: 16
};

const pinch = {
  tsp: 8
};

const tsp = {
  tbsp: 3,
  avrb: 'tsp',
  full: 'teaspoon',
  rank: 1,
  standards: eighth.concat(fractions)
};

const tbsp = {
  oz: 2,
  abrv: 'tbsp',
  full: 'tablespoon',
  rank: 2
};

const oz = {
  cup: 8,
  abrv: 'oz',
  full: 'ounce',
  rank: 3
};

const cup = {
  pint: 2,
  rank: 4,
  standards: fractions
};

const pint = {
  quart: 2,
  oz: 16,
  rank: 5
};

const quart = {
  gallon: 4,
  equivalent: liter,
  rank: 6
};

const gallon = {
  rank: 7
};

const americanStandard = [dash, pinch, tsp, tbsp, oz, cup, pint, quart, gallon];

function convert(opts) {
  var qty = opts.qty,
    measurement = opts.measurement;

  return qty + measurement;
}
