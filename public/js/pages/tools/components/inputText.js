const React = require('react');

function InputText(props) {
  return (
    <input
      className='form-field ff-wide'
      type='text'
      name={props.name}
      id={props.name}
      placeholder={props.ph}
      onChange={props.onChange}
      value={props.value} />
  );
}

module.exports = InputText;
