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
_addRatios(americanStandard);

function _addRatios(measurements) {
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

module.exports.americanStandard = americanStandard;
