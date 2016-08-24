var _ = require('lodash');
var async = require('async');
var utils = require(process.cwd() + '/utils/global');
var dbUtils = require(process.cwd() + '/utils/db');

exports = module.exports = function(req, res, next) {
  var l = res.locals,
    modelName = req.params.model,
    Model,
    MongooseModel,
    template = 'admin/model';
  l.modelName = modelName;

  // Load the model.
  try {
    Model = require(dbUtils.buildModelPath(modelName));
  } catch (err) {
    res.status(500);
    next(err);
  }
  MongooseModel = Model.model;

  // Do upserts and get all documents.
  async.waterfall([
    upsert,
    populateSchema,
    getAll
  ], function(err) {
    return res.render(template);
  });

  function populateSchema(cb) {
    var data = new MongooseModel(req.body).toObject();
    l.populatedSchema = dbUtils.schemaDefaultsPopulated(data, Model);
    cb();
  }

  function getAll(cb) {
    MongooseModel.find()
      .sort(Model.adminModelSort || {
        _id: 1
      })
      .select(Model.adminModelSelect || {})
      .exec(function(err, data) {
        l.models = data;
        cb(null);
      });
  }

  function upsert(cb) {
    if (req.method !== 'POST') return cb(null);
    var m = new MongooseModel(req.body);
    m.save(function(err, savedModel) {
      if (err) return cb();
      res.redirect('/admin/' + modelName + '/' + savedModel._id);
    });
  }
};
