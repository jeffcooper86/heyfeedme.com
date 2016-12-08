var async = require('async');
var _ = require('lodash');

var cache = require(process.cwd() + '/utils/cache');
var utils = require(process.cwd() + '/utils/global');
var dbUtils = require(process.cwd() + '/utils/db');

exports = module.exports = function(req, res, next) {
  var l = res.locals,
    modelName = req.params.model,
    documentId = req.params.documentId,
    doc,
    query,
    action = utils.i.getNested(req, 'body.action') || '',
    Model,
    MongooseModel,
    template = 'admin/document',
    reqData;

  l.crumbs = [
    [modelName, utils.i.trimDirectories(req.path, 1)],
    [documentId]
  ];
  l.modelName = modelName;
  l.docId = documentId;
  l.filters.db = dbUtils;

  // Load the model.
  try {
    Model = require(dbUtils.buildModelPath(modelName.slice(0, -1)));
  } catch (err) {
    res.status(500);
    next(err);
  }
  MongooseModel = Model.model;
  reqData = dbUtils.formatReqData(req.body, MongooseModel.schema.paths);

  async.waterfall([
    getDocument,
    updateDocument,
    removeDocument,
    cancelEdit,
    populateSchema
  ], function(err) {
    if (err) return res.render('_error500');
    return res.render(template);
  });

  function cancelEdit(cb) {
    if (req.method !== 'POST' || action !== 'cancel') return cb();
    res.redirect('/admin/' + modelName);
  }

  function getDocument(cb) {
    var refs = dbUtils.getRefFields(MongooseModel.schema);
    query = MongooseModel.findById(documentId);

    // Auto populate refs.
    refs.forEach(function(ref) {
      query.populate(ref);
    });

    query.exec(function(err, document) {
      if (err || !document) {
        res.status(500);
        res.render('_error500');
      }
      doc = document;
      l.doc = doc;
      cb();
    });
  }

  function populateSchema(cb) {
    var data = doc;
    l.populatedSchema = dbUtils.schemaPopulated(
      data,
      utils.stripPrivates(dbUtils.schemaOfModel(Model))
    );
    cb();
  }

  function removeDocument(cb) {
    if (req.method !== 'POST' || action !== 'delete') return cb();
    query.remove(function() {
      res.redirect('/admin/' + modelName);
    });
  }

  function updateDocument(cb) {
    if (req.method !== 'POST' || action !== 'update') return cb();
    reqData = _trimEmptyRequestData(reqData);
    reqData = _trimEmptyArrayReqData(reqData);
    doc.update(reqData, function(err) {
      if (err) {
        console.error(err);
        req.flash('error', 'Error updating the document.');
        req.flash('error', `${err.message}.`);
        cb();
      } else {
        req.flash('success', `${modelName.slice(0, -1)} saved.`);
        cache.reset();

        // Need to get document again - findByIdAndUpdate is limiting
        // http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        getDocument(cb);
      };
    });
  }

  function _trimEmptyRequestData(data) {
    var newD = _.cloneDeep(data);
    _.forEach(newD, function(value, key) {
      if (_.isObject(value) || _.isArray(value)) {
        newD[key] = _trimEmptyRequestData(value);
      } else if (!_.isArray(data) && value.length === 0) {
        delete newD[key];
      }
    });
    return newD;
  }

  function _trimEmptyArrayReqData(data) {
    return dbUtils.formatReqDataArrays(data, MongooseModel.schema.paths);
  }
};
