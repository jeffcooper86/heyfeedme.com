const React = require('react');

const InputText = require('../components/inputText');
const Select = require('../components/select');
const measurements = require('../../../../../utils/conversion-measurements');
const units = measurements.americanStandard;

class ConversionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.initialVals;
    this.onFormChange = this.onFormChange.bind(this);
  }

  onFormChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, () => this.props.calcResult(this.state));
  }

  render() {
    return (
      <div className='form form-small'>

        <div className='form-group'>
          <label htmlFor='amount'>Amount</label>
          <InputText
            name='amount'
            ph='1'
            value={this.state.amount}
            onChange={this.onFormChange} />
          <Select
            name='from'
            id='from'
            opts={units}
            value={this.state.from}
            onChange={this.onFormChange} />
        </div>

        <div className='form-group'>
          <label htmlFor='to'>To</label>
          <Select
            name='to'
            id='to'
            opts={units}
            value={this.state.to}
            onChange={this.onFormChange} />
        </div>

        <div className='form-group'>
          <label htmlFor='adjustment'>Adjustment</label>
          <InputText
            name='adjustment'
            ph='1'
            value={this.state.adjustment}
            onChange={this.onFormChange} />
        </div>
      </div>
    );
  }
}

module.exports = ConversionForm;
