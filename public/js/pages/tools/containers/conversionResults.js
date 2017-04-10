const React = require('react');

function RawConversion(props) {
  const r = props.result;
  const unit = r.formatted.toUnitFull;

  return (
    <div>
      <h4 className='heading h4 no-space-top'>Result</h4>
      <p>{`${r.formatted.toAmt} ${unit}`}</p>
    </div>
  );
}

function RoundedConversion(props) {
  const r = props.result;
  const diff = r.raw.closestFraction.diff;
  const toUnit = r.formatted.toUnit;
  const vals = r.raw.closestFraction.vals.map((val, i) =>
    <span key={i}>{val.mixed || val.fraction} {val.int === 0 ? '' : toUnit}</span>
  );

  return (
    <div>
      <h4 className='heading h4'>Rounded</h4>
      <p>
        {vals}
        <br />
        <em className='text-emphasis'>{`difference: ${diff} ${toUnit}`}</em>
      </p>
    </div>
  );
}

function ConversionResults(props) {
  const r = props.result;
  return (
    <div className='note'>
      {r &&
        <div>
          <RawConversion result={r} />
          {r.raw.closestFraction && <RoundedConversion result={r} />}
        </div>
      }
    </div>
  );
}

module.exports = ConversionResults;
