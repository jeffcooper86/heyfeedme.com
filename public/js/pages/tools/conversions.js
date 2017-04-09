const React = require('react');
const ReactDOM = require('react-dom');

const ConversionResults = require('./containers/conversionResults');
const ConversionForm = require('./containers/conversionForm');

ReactDOM.render(
  <div>
    <ConversionForm />
    <ConversionResults />
  </div>,
  document.getElementById('calculator')
);
