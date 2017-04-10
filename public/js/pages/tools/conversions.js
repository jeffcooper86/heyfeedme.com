const React = require('react');
const ReactDOM = require('react-dom');

const cUtils = require('../../../../utils/conversion');
const ConversionResults = require('./containers/conversionResults');
const ConversionForm = require('./containers/conversionForm');

class ConversionTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversion: null
    };

    this.calcResult = this.calcResult.bind(this);
  }

  calcResult(opts) {
    const res = cUtils.convertFormatted(opts);
    this.setState({
      conversion: res
    });
  }

  render() {
    return (
      <div>
        <ConversionForm calcResult={this.calcResult}/>
        <ConversionResults result={this.state.conversion}/>
      </div>
    );
  }
}

ReactDOM.render(
  <ConversionTool />,
  document.getElementById('calculator')
);
