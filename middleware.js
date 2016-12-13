var async = require('async');
var cloudinary = require('cloudinary');
var fs = require('fs');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var multer = require('multer');

// App.
var dbUtils = require(process.cwd() + '/utils/db');
var utils = require(process.cwd() + '/utils/global');
var recipeUtils = require(process.cwd() + '/utils/recipes');
var env = process.env;

module.exports.clearUnusedFiles = clearUnusedFiles;
module.exports.cloudStorage = cloudStorage;
module.exports.dbConnect = dbConnect;
module.exports.getSetEnv = getSetEnv;
module.exports.readMultipartData = readMultipartData;
module.exports.requireAuthentication = requireAuthentication;
module.exports.setGlobalData = setGlobalData;
module.exports.setTemplateFilters = setTemplateFilters;
module.exports.uploadRecipePhotos = uploadRecipePhotos;
module.exports.wwwRedirect = wwwRedirect;

function clearUnusedFiles(req, res, next) {
  // var stepsPhotos = req.body['steps.photo'],
  //   photosPath = dbUtils.getPhotosPath(req, 'recipes') + 'steps.photo/',
  //   photosSaved;
  //
  // try {
  //   photosSaved = fs.readdirSync(photosPath);
  // } catch (err) {}
  //
  // if (!photosSaved) return next();
  // stepsPhotos = stepsPhotos.map(function(p) {
  //   p = p.split('/');
  //   return p[p.length - 1];
  // });
  // photosSaved.forEach(function(p) {
  //   if (stepsPhotos.indexOf(p) === -1) {
  //     fs.unlinkSync(photosPath + p);
  //   }
  // });
  next();
}

function cloudStorage(req, res, next) {
  var stepsPhotos = req.body['steps.photo'],
    photoFile = req.files['photo-file'],
    stepsPhotoFiles = req.files['steps.photo-file'];

  async.parallel([
    _upLoadPhotoFile,
    _uploadStepsPhotoFiles
  ], function(err) {
    if (err) {
      return res.render('_error500');
    }
    next();
  });

  function _upLoadPhotoFile(cb) {
    if (photoFile) {
      photoFile = photoFile[0];
      cloudinary.uploader.upload(photoFile.path, function(cphoto) {
        req.body['photo'] = cphoto.secure_url;
        cb();
      }, {
        public_id: `hfm/${utils.i.stripFileExtension(photoFile.path.replace('temp/', ''))}`
      });
    } else cb();
  }

  function _uploadStepsPhotoFiles(cb) {
    if (stepsPhotoFiles) {
      var length = stepsPhotoFiles.length,
        count = 0;

      stepsPhotoFiles.forEach(function(f) {
        var originalPath = f.destination.replace('./temp', '') + f.originalname;
        cloudinary.uploader.upload(f.path, function(cphoto) {
          stepsPhotos[stepsPhotos.indexOf(originalPath)] = cphoto.secure_url;
          count++;
          if (count === length) cb();
        }, {
          folder: `hfm/${f.destination.replace('./temp/', '').replace('.', '-')}`
        });
      });
    } else cb();
  }
}

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

function uploadRecipePhotos(opts) {
  var storage = multer.diskStorage({

    destination: function(req, file, cb) {
      var path = `./temp${makePath(req, file)}`,
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
    var ext = utils.i.getFileExt(file.originalname),
      n = req.body.name ?
      utils.i.slugify(req.body.name) : file.originalname,
      files,
      rn = utils.makeRandomFileName(ext);

    if (file.fieldname === 'steps.photo-file') {
      try {
        files = fs.readdirSync(makePath(req, file));
      } catch (err) {
        files = [];
      }

      if (files) {
        while (files.indexOf(rn) > -1) {
          rn = utils.makeRandomFileName(ext);
        }
      }
      return rn;
    } else return `${n}.${ext}`.toLowerCase();
  }

  function makePath(req, file) {
    return `${dbUtils.getPhotosPath(req, 'recipes')}${file.fieldname.slice(0, file.fieldname.length - 5)}/`;
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
