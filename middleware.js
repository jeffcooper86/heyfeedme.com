var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var multer = require('multer');

// App.
var globalUtils = require(process.cwd() + '/utils/global');
var recipeUtils = require(process.cwd() + '/utils/recipes');

module.exports.dbConnect = dbConnect;
module.exports.filesAsPaths = filesAsPaths;
module.exports.getSetEnv = getSetEnv;
module.exports.readMultipartData = readMultipartData;
module.exports.requireAuthentication = requireAuthentication;
module.exports.setGlobalData = setGlobalData;
module.exports.setTemplateFilters = setTemplateFilters;
module.exports.uploadRecipe = uploadRecipe;


function dbConnect(req, res, next) {
  if (mongoose.connections &&
    mongoose.connections[0]._readyState === 1) return next();

  if (process.env.NODE_ENV === 'development' || !process.env.APP_CONFIG) {
    mongoose.connect(`mongodb://localhost/${process.env.APP}`);
  } else {
    var config = JSON.parse(process.env.APP_CONFIG);
    mongoose.connect('mongodb://' + config.mongo.user + ':' + process.env.MONGO_PW + '@' + config.mongo.hostString);
  }

  var db = mongoose.connection;
  db.on('error', function() {
    console.log('Error connecting to db - is mongodb installed and running?');
    next();
  });
  db.once('open', function() {
    req.db = db;
    next();
  });
}

function filesAsPaths(req, res, next) {
  _.forEach(req.files, function(file) {
    var f = file[0];
    req.body[f.fieldname] = f.path.slice(7);
  });
  next();
}

function getSetEnv(req, res, next) {
  res.locals.NODE_ENV = process.env.NODE_ENV;
  next();
}

function readMultipartData() {
  return multer().array();
}

function requireAuthentication(req, res, next) {
  if (req.session.auth) return next();
  return res.redirect('/auth?ref=' + req.path);
}

function setGlobalData(req, res, next) {
  res.locals.data = {};
  res.locals.data.recipes = {
    categories: recipeUtils.getCategories(),
    activeCats: recipeUtils.getActiveCategories(req),
    classifications: recipeUtils.getClassifications(),
    activeClasses: recipeUtils.getActiveClassifications(req)
  };
  next();
}

function setTemplateFilters(req, res, next) {
  res.locals.filters = globalUtils;
  next();
}

function uploadRecipe(opts) {
  var storage = multer.diskStorage({

    destination: function(req, file, cb) {
      var path = `./public/images/photos/recipes/u/${req.params.documentId}/${file.fieldname}/`,
        fileName = makeFileName(req, file);

      try {
        fs.accessSync(path);
      } catch (err) {
        mkdirp.sync(path);
      }

      // Remove any old file of the same name.
      try {
        fs.unlinkSync(path + fileName);
      } catch (err) {}

      cb(null, path);
    },

    filename: function(req, file, cb) {
      cb(null, makeFileName(req, file));
    }
  });

  function makeFileName(req, file) {
    var n = req.body.name ?
      globalUtils.i.slugify(req.body.name) : file.originalname;
    n = `${n}.${globalUtils.i.getFileExt(file.originalname)}`;
    return n.toLowerCase();
  }
  return multer({
    storage: storage
  }).fields(opts);
}
