const React = require('react');


function ConversionResults(props) {
  const r = props.result;
  if (!r) return <div></div>;

  const unit = r.formatted.toUnitFull;
  return (
    <div className='note'>
        <pre>{JSON.stringify(props.result)}</pre>
        <h4 className='heading h4 no-space-top'>Result</h4>
        <p>{`${r.formatted.toAmt} ${unit}`}</p>
        <h4 className='heading h4'>Rounded</h4>
        <p>
          <span>rounded result</span>
          <br />
          <em className='text-emphasis'>difference: result placeholder</em>
        </p>
      </div>
  );
}

module.exports = ConversionResults;
