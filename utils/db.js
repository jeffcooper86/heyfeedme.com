var _ = require('lodash');
var utils = require(process.cwd() + '/utils/global');

module.exports.buildModelPath = buildModelPath;
module.exports.schemaDefaults = schemaDefaults;
module.exports.schemaDefaultsPopulated = schemaDefaultsPopulated;
module.exports.schemaOfModel = schemaOfModel;
module.exports.schemaPopulated = schemaPopulated;


function buildModelPath(modelName) {
  return process.cwd() + '/models/' +  _.capitalize(modelName.slice(0, -1))
    + '.js'
}

function schemaDefaults(schema, Model) {
  var newSchema = _.cloneDeep(schema);
  if (Model.adminModelDefaults) return _.pick(newSchema, Model.adminModelDefaults);
  return newSchema;
}

function schemaDefaultsPopulated(data, Model) {
  return utils.stripPrivates(
    _schemaDefaults(_schemaPopulated(data, _schemaOfModel(Model)), Model)
  );
}

function schemaOfModel(Model) {
  return Model.model.schema.paths;
}

function schemaPopulated(data, schema) {
  var newSchema = _.cloneDeep(schema);
  for (var key in data) {
    if (newSchema[key]) newSchema[key].data = data[key];
  }
  return newSchema;
}
