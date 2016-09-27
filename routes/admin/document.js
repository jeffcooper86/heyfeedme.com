var async = require('async');
var _ = require('lodash');
var utils = require(process.cwd() + '/utils/global');
var dbUtils = require(process.cwd() + '/utils/db');

exports = module.exports = function(req, res, next) {
  var l = res.locals,
    modelName = req.params.model,
    documentId = req.params.documentId,
    doc,
    query,
    action = req.body.action || '',
    Model,
    MongooseModel,
    template = 'admin/document',
    reqData;

  l.crumbs = [
    [modelName, utils.i.trimDirectories(req.path, 1)],
    [documentId]
  ];
  l.docId = documentId;
  l.filters.db = dbUtils;

  // Load the model.
  try {
    Model = require(dbUtils.buildModelPath(modelName));
  } catch (err) {
    res.status(500);
    next(err);
  }
  MongooseModel = Model.model;
  reqData = formatReqData(req.body, MongooseModel.schema.paths);

  async.waterfall([
    getDocument,
    updateDocument,
    removeDocument,
    populateSchema
  ], function(err) {
    if (err) return res.render('_error500');
    return res.render(template);
  });

  function populateSchema(cb) {
    var data = doc;
    l.populatedSchema = utils.stripPrivates(
      dbUtils.schemaPopulated(data, dbUtils.schemaOfModel(Model))
    );
    cb();
  }

  function getDocument(cb) {
    query = MongooseModel.findById(documentId, function(err, document) {
      if (err || !document) {
        res.status(500);
        res.render('_error500');
      }
      doc = document;
      cb();
    });
  }

  function formatReqData(data, schema) {

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

  function removeDocument(cb) {
    if (req.method !== 'POST' || action !== 'delete') return cb();
    query.remove(function() {
      res.redirect('/admin/' + modelName);
    });
  }

  function updateDocument(cb) {
    if (req.method !== 'POST' || action !== 'update') return cb();
    _trimEmptyArrayReuqestData(reqData);
    doc.update(reqData, function(err) {

      if (err) {
        console.log(err);
        req.flash('error', 'Error updating the document.');
      }
      req.flash('success', 'Document saved.');

      // Need to get document again - findByIdAndUpdate is limiting
      // http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
      getDocument(cb);
    });
  }

  function _trimEmptyArrayReuqestData(data) {
    _.forEach(data, function(value) {
      if (_.isArray(value)) {
        _.remove(value, function(v) {
          return v.length === 0;
        });
      }
    });
  }
};
