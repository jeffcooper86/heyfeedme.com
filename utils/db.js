var _ = require('lodash');
var utils = require(process.cwd() + '/utils/global');

module.exports.buildModelPath = _buildModelPath;
module.exports.schemaDefaults = _schemaDefaults;
module.exports.schemaDefaultsPopulated = _schemaDefaultsPopulated;
module.exports.schemaOfModel = _schemaOfModel;
module.exports.schemaPopulated = _schemaPopulated;

function _buildModelPath(modelName) {
  return process.cwd() + '/models/' +  _.capitalize(modelName.slice(0, -1))
    + '.js'
}

function _schemaDefaults(schema, Model) {
  var newSchema = _.cloneDeep(schema);
  if (Model.adminModelDefaults) return _.pick(newSchema, Model.adminModelDefaults);
  return newSchema;
}

function _schemaDefaultsPopulated(data, Model) {
  return utils.stripPrivates(
    _schemaDefaults(_schemaPopulated(data, _schemaOfModel(Model)), Model)
  );
}

function _schemaOfModel(Model) {
  return Model.model.schema.paths;
}

function _schemaPopulated(data, schema) {
  var newSchema = _.cloneDeep(schema);
  for (var key in data) {
    if (newSchema[key]) newSchema[key].data = data[key];
  }
  return newSchema;
}
