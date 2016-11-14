var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var multer = require('multer');

// App.
var utils = require(process.cwd() + '/utils/global');
var recipeUtils = require(process.cwd() + '/utils/recipes');
var env = process.env;

module.exports.dbConnect = dbConnect;
module.exports.filesAsPaths = filesAsPaths;
module.exports.getSetEnv = getSetEnv;
module.exports.readMultipartData = readMultipartData;
module.exports.requireAuthentication = requireAuthentication;
module.exports.setGlobalData = setGlobalData;
module.exports.setTemplateFilters = setTemplateFilters;
module.exports.uploadRecipe = uploadRecipe;
module.exports.wwwRedirect = wwwRedirect;

function dbConnect(req, res, next) {
  var dbstr,
    mongoc = utils.i.getNested(JSON.parse(env.APP_CONFIG), 'mongo');

  if (mongoose.connections &&
    mongoose.connections[0]._readyState === 1) return next();

  switch (env.NODE_ENV) {
    case 'production-local':
      dbstr = `mongodb://${mongoc.user}:${env.MONGO_PW}@${mongoc.hostString}/${mongoc.db}`;
      break;
    case 'production':
      dbstr = `mongodb://${mongoc.user}:${env.MONGO_PW}@${mongoc.hostString}`;
      break;
    default:
      dbstr = `mongodb://localhost/${env.APP}`;
      break;
  }

  mongoose.connect(dbstr);
  var db = mongoose.connection;
  db.on('error', function(err) {
    console.error(err);
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
  res.locals.NODE_ENV = env.NODE_ENV;
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
  res.locals.filters = utils;
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
      utils.i.slugify(req.body.name) : file.originalname;
    n = `${n}.${utils.i.getFileExt(file.originalname)}`;
    return n.toLowerCase();
  }
  return multer({
    storage: storage
  }).fields(opts);
}

function wwwRedirect(req, res, next) {
  if (env === 'production' && req.headers.host.slice(0, 4) !== 'www.') {
    return res.redirect(301, `${req.protocol}://www.${req.headers.host}${req.originalUrl}`);
  }
  next();
}
