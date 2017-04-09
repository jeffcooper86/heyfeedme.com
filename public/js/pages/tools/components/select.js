const React = require('react');

function Select(props) {
  const options = props.opts.map(option => {
    return (
      <option key={option.name.full} value={option.name.full}>
        {option.name.full}
      </option>
    );
  });
  return (
    <div className='select-wrap form-field ff-wide'>
      <select
        className='form-field ff-wide'
        name={props.name}
        id={props.id}
        value={props.value}
        onChange={props.onChange}>
        {options}
      </select>
    </div>
  );
}

module.exports = Select;
