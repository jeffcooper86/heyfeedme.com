var async = require('async');
var cloudinary = require('cloudinary');
var fs = require('fs');
var mkdirp = require('mkdirp');
var multer = require('multer');

// App.
var dbUtils = require(process.cwd() + '/utils/db');
var utils = require(process.cwd() + '/utils/global');
var env = process.env;

module.exports.clearUnusedPhotos = clearUnusedPhotos;
module.exports.storePhotos = storePhotos;
module.exports.uploadRecipePhotos = uploadRecipePhotos;

function clearUnusedPhotos(req, res, next) {
  switch (env.NODE_ENV) {
    case 'development':
      _clearLocalPhotos(req, res, next);
      break;
    default:
      _clearCloudPhotos(req, res, next);
  }
}

function storePhotos(req, res, next) {
  switch (env.NODE_ENV) {
    case 'development':
      _localStorage(req, res, next);
      break;
    default:
      _cloudStorage(req, res, next);
      break;
  }
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

function _clearCloudPhotos(req, res, next) {
  var stepsPhotos = req.body['steps.photo'];
  cloudinary.api.resources(
    function(cPhotos) {
      var toDelete = cPhotos.resources.filter(function(val) {
        return stepsPhotos.indexOf(val.secure_url) < 0;
      });
      toDelete = toDelete.map(function(val) {
        return val.public_id;
      });
      if (toDelete.length) {
        cloudinary.api.delete_resources(toDelete, function(data) {
          return;
        });
      }
      next();
    }, {
      prefix: `hfm/recipes/${req.params.documentId}/steps-photo/`,
      type: 'upload'
    }
  );
}

function _clearLocalPhotos(req, res, next) {
  var stepsPhotos = req.body['steps.photo'],
    photosPath = `./temp${dbUtils.getPhotosPath(req, 'recipes')}steps.photo/`,
    photosSaved;

  try {
    photosSaved = fs.readdirSync(photosPath);
  } catch (err) {}

  if (!photosSaved) return next();
  stepsPhotos = stepsPhotos.map(function(p) {
    p = p.split('/');
    return p[p.length - 1];
  });
  photosSaved.forEach(function(p) {
    if (stepsPhotos.indexOf(p) === -1) {
      fs.unlinkSync(photosPath + p);
    }
  });
  next();
}

function _cloudStorage(req, res, next) {
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

function _localStorage(req, res, next) {
  var stepsPhotos = req.body['steps.photo'],
    photoFile = req.files['photo-file'],
    stepsPhotoFiles = req.files['steps.photo-file'];

  if (photoFile) {
    photoFile = photoFile[0];
    req.body['photo'] = photoFile.path.replace('temp', '');
  }

  if (stepsPhotoFiles) {
    stepsPhotoFiles.forEach(function(f) {
      var originalPath = f.destination.replace('./temp', '') + f.originalname;
      stepsPhotos[stepsPhotos.indexOf(originalPath)] = f.path.replace('temp', '');
    });
  }
  next();
}
