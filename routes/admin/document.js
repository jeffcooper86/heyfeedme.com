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
    template = 'admin/document';

  l.crumbs = [
    [modelName, utils.trimDirectories(req.path, 1)],
    [documentId]
  ];

  // Load the model.
  try {
    Model = require(dbUtils.buildModelPath(modelName));
  } catch (err) {
    res.status(500);
    next(err);
  }
  MongooseModel = Model.model;

  async.waterfall([
    getDocument,
    updateDocument,
    removeDocument,
    populateSchema
  ], function(err) {
    res.render(template);
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

  function removeDocument(cb) {
    if (req.method !== 'POST' || action !== 'delete') return cb();
    query.remove(function(err) {
      res.redirect('/admin/' + modelName);
    });
  }

  function updateDocument(cb) {
    if (req.method !== 'POST' || action !== 'update') return cb();
    _trimEmptyArrayReuqestData(req.body)
    doc.update(req.body, function(err, res) {

      if (err) console.log(err);

      // Need to get document again - findByIdAndUpdate is limiting
      // http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
      getDocument(cb);
    });
  }

  function _trimEmptyArrayReuqestData(data) {
    _.forEach(data, function(value) {
      if (_.isArray(value)) {
        _.remove(value, function(val) {
          return val.length === 0;
        });
      }
    });
  }
};
