var async = require('async');
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
  l.schema = MongooseModel.schema.paths;
  l.tableColumns = Model.adminModelTable;

  // Do creates and get all documents.
  async.waterfall([
    create,
    populateSchema,
    getAll
  ], function(err) {
    if (err) return res.render('_error500');
    return res.render(template);
  });

  function create(cb) {
    if (req.method !== 'POST') return cb(null);
    var m = new MongooseModel(req.body);
    m.save(function(err, savedModel) {

      // Stay on the page.
      if (err) return cb();
      res.redirect('/admin/' + modelName + '/' + savedModel._id);
    });
  }

  function getAll(cb) {
    MongooseModel.find()
      .sort(Model.adminModelSort || {
        _id: 1
      })
      .select(Model.adminModelSelect || {})
      .exec(function(err, data) {
        l.docs = data;
        cb(null);
      });
  }

  // Populate the schema for create with req.body.
  function populateSchema(cb) {
    var data = new MongooseModel(req.body).toObject();
    l.populatedSchema = dbUtils.schemaDefaultsPopulated(data, Model);
    cb();
  }
};
