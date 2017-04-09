const React = require('react');

class ConversionResults extends React.Component {
  render() {
    return (
      <div className='note'>
        <h4 className='heading h4 no-space-top'>Result</h4>
        <p>result placeholder</p>
        <h4 className='heading h4'>Rounded</h4>
        <p>
          <span>rounded result</span>
          <br />
          <em className='text-emphasis'>difference: result placeholder</em>
        </p>
      </div>
    );
  }
}

module.exports = ConversionResults;
