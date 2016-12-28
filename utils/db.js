var _ = require('lodash');
var async = require('async');

var utils = require(process.cwd() + '/utils/global');
var cloudinaryUtils = require(process.cwd() + '/utils/cloudinary');

module.exports.buildModelPath = buildModelPath;
module.exports.formatReqData = formatReqData;
module.exports.formatReqDataArrays = formatReqDataArrays;
module.exports.formatReqDataBools = formatReqDataBools;
module.exports.formatReqDataDocArrays = formatReqDataDocArrays;
module.exports.getPhotosPath = getPhotosPath;
module.exports.getRefFields = getRefFields;
module.exports.schemaDefaults = schemaDefaults;
module.exports.schemaDefaultsPopulated = schemaDefaultsPopulated;
module.exports.schemaOfModel = schemaOfModel;
module.exports.schemaPopulated = schemaPopulated;
module.exports.schemaPopulatedWithRefsAsync = schemaPopulatedWithRefsAsync;
module.exports.trimEmptyNonStrRequestData = trimEmptyNonStrRequestData;

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
  newD = trimEmptyNonStrRequestData(newD, schema);
  return newD;
}

function formatReqDataArrays(data, schema) {
  data = _.cloneDeep(data);
  _.forEach(schema, function(field) {
    if (field.instance === 'Array') {
      if (!_.isArray(data[field.path])) data[field.path] = [data[field.path] || ''];
      data[field.path] = data[field.path].filter(function(data) {
        if (typeof data === 'string') return data.length > 0;
        return true;
      });
    }
  });
  return data;
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

function getRefFields(schema, scope) {
  var refs = [];
  schema.eachPath(function(path, schemaType) {
    var scopedPath = scope ? `${scope}.${path}` : path;
    if (utils.i.getNested(schemaType, 'caster.options.ref') ||
      utils.i.getNested(schemaType, 'options.ref')) {
      refs.push(scopedPath);
    } else if (schemaType.$isMongooseDocumentArray) {
      refs = refs.concat(getRefFields(schemaType.schema, scopedPath));
    }
  });
  return refs;
}

function getPhotosPath(req, name) {
  return `/${name}/${req.params.documentId}/`;
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
  var newSchema = _.cloneDeep(schema),
    val;
  for (var key in data) {
    val = newSchema[key];
    if (val) {
      val.data = data[key];
      if (val.options && val.options.file === 'image' && val.options.cdn === 'cloudinary') {
        val.data = cloudinaryUtils.optimized(data[key]).scaled.c;
      }
    }
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

function trimEmptyNonStrRequestData(data, schema) {
  data = _.cloneDeep(data);
  _.forEach(schema, function(field) {
    var inst = field.instance;
    if (data[field.path] === '' && inst !== 'String') {
      delete data[field.path];
    } else if (field.$isMongooseDocumentArray && data[field.path]) {
      data[field.path].forEach(function(d, i) {
        data[field.path][i] = trimEmptyNonStrRequestData(data[field.path][i], field.schema.paths);
      });
    }
  });
  return data;
}
