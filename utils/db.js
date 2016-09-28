var _ = require('lodash');
var utils = require(process.cwd() + '/utils/global');

module.exports.buildModelPath = buildModelPath;
module.exports.formatReqDataDocArrays = formatReqDataDocArrays;
module.exports.schemaDefaults = schemaDefaults;
module.exports.schemaDefaultsPopulated = schemaDefaultsPopulated;
module.exports.schemaOfModel = schemaOfModel;
module.exports.schemaPopulated = schemaPopulated;


function buildModelPath(modelName) {
  return process.cwd() + '/models/' + _.capitalize(modelName.slice(0, -1)) +
    '.js';
}

function formatReqDataDocArrays(data, schema) {

  data = _.cloneDeep(data);

  // Group scoped values belonging to document arrays as an object.
  var docArrays = {};
  _.forEach(data, function(v, k) {
    k = k.split('.');
    if (k.length > 1 &&
      utils.i.getNested(schema, k[0] + '.$isMongooseDocumentArray')) {
      if (!(k[0] in docArrays)) docArrays[k[0]] = {};
      docArrays[k[0]][k[1]] = v;
      delete data[k.join('.')];
    }
  });

  // Loop the scoped values objects.
  _.forEach(docArrays, function(scopedVs, k) {
    var docArray = [];

    // Turn the object of array values into an array of objects.
    _.forEach(scopedVs, function(vArray, k) {
      vArray.forEach(function(v, i) {
        if (!(docArray[i])) docArray[i] = {};
        docArray[i][k] = v;
      });
    });

    utils.trimEmptyObjectsFromArray(docArray);
    data[k] = docArray;
  });

  return data;
}

function schemaDefaults(schema, Model) {
  var newSchema = _.cloneDeep(schema);
  if (Model.adminModelDefaults) return _.pick(
    newSchema, Model.adminModelDefaults
  );
  return newSchema;
}

function schemaDefaultsPopulated(data, Model) {
  return utils.stripPrivates(
    schemaDefaults(schemaPopulated(data, schemaOfModel(Model)), Model)
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
