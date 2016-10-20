var _ = require('lodash');
var async = require('async');

var utils = require(process.cwd() + '/utils/global');

module.exports.buildModelPath = buildModelPath;
module.exports.formatReqData = formatReqData;
module.exports.formatReqDataDocArrays = formatReqDataDocArrays;
module.exports.formatReqDataBools = formatReqDataBools;
module.exports.schemaDefaults = schemaDefaults;
module.exports.schemaDefaultsPopulated = schemaDefaultsPopulated;
module.exports.schemaOfModel = schemaOfModel;
module.exports.schemaPopulated = schemaPopulated;
module.exports.schemaPopulatedWithRefsAsync = schemaPopulatedWithRefsAsync;

function formatCurrentDateFromReqData(data) {
  data = _.cloneDeep(data);
  _.forEach(data, function(d, k) {
    if (d === 'dateCurrent') data[k] = Date.now();
  });
  return data;
}

function addPublishedDate(data, schema) {
  data = _.cloneDeep(data);
  if (!data.publish) return data;

  if (!data.published && schema.published) {
    data.published = Date.now();
  }
  return data;
}

function buildModelPath(modelName) {
  return `${process.cwd()}/models/${modelName}.js`;
}

function formatReqData(data, schema) {
  var newD = formatCurrentDateFromReqData(data);
  newD = addPublishedDate(newD, schema);
  newD = formatReqDataDocArrays(newD, schema);
  newD = formatReqDataBools(newD, schema);
  newD = trimEmptyReqDataArrays(newD, schema);
  return newD;
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

      if (!Array.isArray(vArray)) {

        // There is only one document, so it is not an array of values.
        if (!docArray.length) docArray.push({});
        docArray[0][k] = vArray;
        return;
      }

      // Add the values in the array to each corresponding document.
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

function formatReqDataBools(data, schema) {
  data = _.cloneDeep(data);
  _.forEach(schema, function(s, k) {
    if (s.instance === 'Boolean') data[k] = !!data[k];
  });
  return data;
}

/**
 * Filters a schema to only include fields specified with 'adminModelDefaults'.
 * Default fields are used when creating a new document.
 */
function schemaDefaults(schema, Model) {
  var newSchema = _.cloneDeep(schema);
  if (Model.adminModelDefaults) {
    return _.pick(newSchema, Model.adminModelDefaults);
  }
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

/**
 * Populates each schema path with a 'data' field containing an array of data.
 *  schema[someField].data = data.someField;
 * @param {object} data - Data to be populated.
 * @param {object} schema - A mongoosejs schema.
 */
function schemaPopulated(data, schema) {
  var newSchema = _.cloneDeep(schema);
  for (var key in data) {
    if (newSchema[key]) newSchema[key].data = data[key];
  }
  return newSchema;
}

/**
 * Populates each schema path with a 'data' field containing an array of data.
 *  schema[someField].data = data.someField;
 * Populates each schema path with a ref with a 'dataExisting' field containing
 * an array of data.
 *  schema[someField].dataExisting = [0(_id), 'first'(defaultName)];
 * @param {object} data - Data to be populated.
 * @param {object} schema - A mongoosejs schema.
 * @param {function} cb
 */
function schemaPopulatedWithRefsAsync(data, schema, cb) {
  var newSchema = _.cloneDeep(schema),
    refs = [],
    sPath,
    ref,
    Model;

  for (var key in data) {
    sPath = newSchema[key];
    if (!sPath) continue;

    // Add data to the schema path.
    sPath.data = data[key];

    // Add ref data to the schema path.
    if (utils.i.getNested(schema, [key, 'caster', 'instance']) === 'ObjectID') {
      ref = sPath.caster.options.ref;
      refs.push(_refLookUp(ref, sPath));
    }
  }

  async.parallel(refs, function(err) {
    cb(err, newSchema);
  });

  function _refLookUp(ref, sPath) {
    return function refLookUp(cb) {
      try {
        Model = require(buildModelPath(ref));
      } catch (err) {
        cb(err);
      }
      Model.model.find().sort('_id').exec(function(err, docs) {
        if (err) cb(err);
        var refData = docs.map(function(doc) {
          return [doc.id, doc.defaultName || ''];
        });
        refData = _sortOnDefaultname(refData);
        sPath.dataExisting = refData;
        cb(null);
      });
    };
  }

  function _sortOnDefaultname(data) {
    data.sort(function(a, b) {
      return a[1].localeCompare(b[1]);
    });
    return data;
  }
}

function trimEmptyReqDataArrays(data, schema) {
  data = _.cloneDeep(data);
  _.forEach(schema, function(field) {
    if (field.instance === 'Array') {
      if (data[field.path] === '') data[field.path] = [];
    }
  });
  return data;
}
