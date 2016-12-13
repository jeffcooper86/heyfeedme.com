var mongoose = require('mongoose');
var multer = require('multer');

// App.
var utils = require(process.cwd() + '/utils/global');
var recipeUtils = require(process.cwd() + '/utils/recipes');
var env = process.env;

module.exports.dbConnect = dbConnect;
module.exports.getSetEnv = getSetEnv;
module.exports.readMultipartData = readMultipartData;
module.exports.requireAuthentication = requireAuthentication;
module.exports.setGlobalData = setGlobalData;
module.exports.setTemplateFilters = setTemplateFilters;
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

function wwwRedirect(req, res, next) {
  if (env === 'production' && req.headers.host.slice(0, 4) !== 'www.') {
    return res.redirect(301, `${req.protocol}://www.${req.headers.host}${req.originalUrl}`);
  }
  next();
}
