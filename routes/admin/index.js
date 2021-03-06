var fs = require('fs');

var utils = require(process.cwd() + '/utils/global');

exports = module.exports = function(req, res) {
  var l = res.locals;

  // Get all models from the file names
  fs.readdir(process.cwd() + '/models', function(err, files) {
    files.forEach(function(fileName, i) {
      files[i] = utils.i.stripFileExtension(fileName) + 's';
    });

    if (files.length === 1) return res.redirect('/admin/' + files[0]);
    l.models = files;
    res.render('admin/index');
  });
};
