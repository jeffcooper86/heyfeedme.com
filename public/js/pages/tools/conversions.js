const React = require('react');
const ReactDOM = require('react-dom');

const cUtils = require('../../../../utils/conversion');
const ConversionResults = require('./containers/conversionResults');
const ConversionForm = require('./containers/conversionForm');

class ConversionTool extends React.Component {
  constructor(props) {
    super(props);

    const initialFormVals = {
      amount: 1,
      from: 'teaspoon',
      to: 'tablespoon',
      adjustment: 1
    };

    this.calcResult = this.calcResult.bind(this);
    this.initialFormVals = initialFormVals;
    this.state = {
      conversion: cUtils.convertFormatted(initialFormVals)
    };
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
        <ConversionForm calcResult={this.calcResult} initialVals={this.initialFormVals}/>
        <ConversionResults result={this.state.conversion}/>
      </div>
    );
  }
}

ReactDOM.render(
  <ConversionTool />,
  document.getElementById('calculator')
);
