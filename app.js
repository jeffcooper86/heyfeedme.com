const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('flash');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const session = require('express-session');
const slash = require('express-slash');

const MongoStore = require('connect-mongo')(session);

// App.
const middleware = require(process.cwd() + '/middleware');
const routes = requireDir('routes', {
  recurse: true
});

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
app.use(middleware.wwwRedirect);
app.use('/robots.txt', routes._robots);
app.use(middleware.dbConnect);
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION_SECRET
}));
app.use(cookieParser());
app.use(flash());
app.use(slash());
app.use(middleware.getSetEnv);
app.use(middleware.setGlobalData);
app.use(middleware.setTemplateFilters);

/*
 * Routes.
 * ----------------------------
 */

/**
 * Public.
 */

// Recipes
app.get('/', routes.recipes.recipes);
app.get('/recipes/tags', routes.recipes.tags);
app.get('/recipes/tag/:tag([a-z-]+)/:tagId([a-f0-9]{24})', routes.recipes.recipes);
app.get('/recipe/[a-z-]+/:recipeId([a-f0-9]{24})', routes.recipes.recipe);

// Static.
app.get('/about', routes.about.index);

/**
 * API.
 */
// To do: Make api section a router module
app.all('/api/recipes/:html(html)?', routes._api.recipes.recipes);
app.all('/api/recipes/tag/:tag([a-z-]+)/:tagId([a-f0-9]{24})/:html(html)?', routes._api.recipes.recipes);
app.get('/api/recipetags', routes._api.recipes.recipeTags);

/**
 * Auth.
 * Everything below requires auth.
 */
app.all('/auth', routes.auth);
app.use(middleware.requireAuthentication);

/**
 * Admin.
 */
app.route('/admin/:model(recipes)/:documentId')
  .get(routes.admin.document)
  .post(
    middleware.uploadRecipePhotos([{
      name: 'photo',
      maxCount: 1
    }, {
      name: 'steps.photo'
    }]),
    routes.admin.document);

// To do: Make admin section a router module http://expressjs.com/en/guide/routing.html#express-router
app.route('/admin')
  .get(routes.admin.index);
app.route('/admin/:model')
  .get(routes.admin.model)
  .post(routes.admin.model);
app.route('/admin/:model/:documentId')
  .get(routes.admin.document)
  .post(middleware.readMultipartData(), routes.admin.document);

/**
 * Styleguide.
 */
app.get('/style', routes._style);

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
