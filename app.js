var express = require('express');
var app = express();
var requireDir = require('require-dir');
var bodyParser = require('body-parser');
var multer = require('multer');
var slash = require('express-slash');
var cookieParser = require('cookie-parser');
var mkdirp = require('mkdirp');
var _ = require('lodash');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('flash');
const MongoStore = require('connect-mongo')(session);

var fs = require('fs');

// App
var globalUtils = require(process.cwd() + '/utils/global');
var recipeUtils = require(process.cwd() + '/utils/recipes');

/*
 * Settings.
 * ----------------------------
 */
app.enable('strict routing');
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
require('dotenv').config({
  silent: true
});
app.use(dbConnect);
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION_SECRET
}));
app.use(cookieParser());
app.use(flash());
app.use(slash());
app.use(getSetEnv);
app.use(setGlobalData);
app.use(setTemplateFilters);

/*
 * Routes.
 * ----------------------------
 */
var routes = requireDir('routes', {
  recurse: true
});

/**
 * Public.
 */
app.get('/', routes.recipes.recipes);
app.get('/recipe/[a-z\-]+/:recipeId([a-f0-9]{24})', routes.recipes.recipe);
app.get('/search', routes.search.index);

/**
 * API.
 */
// To do: Make api section a router module
app.all('/api/recipes/:html(html)?', routes._api.recipes.recipes);

/**
 * Auth.
 * Everything below requires auth.
 */
app.all('/auth', routes.auth);
app.use(requireAuthentication);

/**
 * Admin.
 */
app.route('/admin/:model(recipes)/:documentId')
  .get(routes.admin.document)
  .post(
    uploadRecipe([{
      name: 'photo',
      maxCount: 1
    }]),
    filesAsPaths,
    routes.admin.document);

// To do: Make admin section a router module http://expressjs.com/en/guide/routing.html#express-router
app.route('/admin')
  .get(routes.admin.index);
app.route('/admin/:model')
  .get(routes.admin.model)
  .post(routes.admin.model);
app.route('/admin/:model/:documentId')
  .get(routes.admin.document)
  .post(routes.admin.document);


app.get('/style-guide', function(req, res) {
  res.render('_style-guide.pug');
});

/*
 * Error Handling.
 * ----------------------------
 */
app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).render('_error500');
});

app.use(function(req, res) {
  res.status(404).render('_error404');
});


/*
 * Start server.
 * ----------------------------
 */
app.listen(process.env.PORT || 3000, function() {});


function dbConnect(req, res, next) {
  if (mongoose.connections &&
    mongoose.connections[0]._readyState === 1) return next();

  if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://localhost/test');
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

function getSetEnv(req, res, next) {
  res.locals.NODE_ENV = process.env.NODE_ENV;
  next();
}

function requireAuthentication(req, res, next) {
  if (req.session.auth) return next();
  return res.redirect('/auth?ref=' + req.path);
}

function setTemplateFilters(req, res, next) {
  res.locals.filters = globalUtils;
  next();
}

function filesAsPaths(req, res, next) {
  _.forEach(req.files, function(file) {
    var f = file[0];
    req.body[f.fieldname] = f.path.slice(7);
  });
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

function setGlobalData(req, res, next) {
  res.locals.data = {};
  res.locals.data.recipes = {
    categories: recipeUtils.getCategories(),
    activeCats: recipeUtils.getActiveCategories(req)
  };
  next();
}
