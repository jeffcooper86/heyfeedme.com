var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
require('gulp-watch');
var browserify = require('browserify');
var es = require('event-stream');
var foreach = require('gulp-foreach');
var source = require('vinyl-source-stream');
var jsPrettify = require('gulp-jsbeautifier');
var csscomb = require('gulp-csscomb');
var diff = require('gulp-diff');
var glob = require('glob');
var cssmin = require('gulp-cssmin');

var utils = require(process.cwd() + '/utils/global.js');

var paths = {
  js: ['./*.js', './routes/**/*.js', './utils/**/*.js', './models/**/*.js'],
  public: {
    dist: './public/dist/',
    less: {
      compile: {
        main: ['./public/styles/site.less'],
        pages: './public/styles/pages/**/*.less'
      },
      watch: ['./public/styles/**/*.less']
    },
    js: {
      compile: {
        main: ['./public/js/main.js'],
        pages: './public/js/pages/**/*.js'
      },
      watch: ['./public/js/**/*.js']
    }
  }
};

gulp.task('default', ['dist']);

// Build tasks
gulp.task('dist:less', function() {
  gulp.src(paths.public.less.compile.main)
    .pipe(less({}))
    .on('error', onWatchError)
    .pipe(autoprefixer({
      browsers: ['> 5%']
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(`${paths.public.dist}styles/`));

  lessPageCompile();
});

gulp.task('dist:js', function() {
  var bundleStream = browserify(paths.public.js.compile.main).bundle();
  bundleStream
    .pipe(source('main.js'))
    .pipe(gulp.dest(`${paths.public.dist}js/`));

  jsPageBundle();
});

gulp.task('dist', ['dist:less', 'dist:js']);


// Watch tasks
gulp.task('watch:less', function() {
  gulp.watch(paths.public.less.watch, ['dist:less']);
});

gulp.task('watch:js', function() {
  gulp.watch(paths.public.js.watch, ['dist:js']);
});

gulp.task('watch', ['watch:less', 'watch:js']);


// Beautifiers
gulp.task('beautify:js', function() {
  beautifyJs();
});

gulp.task('beautify:jsCheck', function() {
  beautifyJs(true);
});

gulp.task('beautify:less', function() {
  beautifyLess();
});

gulp.task('beautify', ['beautify:js', 'beautify:less']);
gulp.task('beautifyCheck', ['beautify:jsCheck', 'beautify:less']);


function beautifyLess() {
  es.merge(
    gulp.src(paths.public.less.watch)
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(csscomb())
        .pipe(gulp.dest(file.base));
    }))
  );
}

function beautifyJs(fail) {
  es.merge(
    gulp.src(paths.js
      .concat(paths.public.js.watch))
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(jsPrettify({
          config: '.jsbeautifyrc'
        }))
        .pipe(jsPrettify.reporter())
        .pipe(diff())
        .pipe(diff.reporter({
          fail: fail,
          quiet: true
        }))
        .pipe(gulp.dest(file.base));
    }))
  );
}

function lessPageCompile() {
  glob(paths.public.less.compile.pages, function(err, files) {
    files.forEach(function(f) {
      gulp.src(f)
        .pipe(less({}))
        .on('error', onWatchError)
        .pipe(autoprefixer({
          browsers: ['> 5%']
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(buildDest(f)));
    });
  });

  function buildDest(f) {
    var dest = `${paths.public.dist}styles/pages`,
      filePath = f.slice(f.indexOf('pages') + 5);
    return `${dest}${utils.i.trimDirectories(filePath, 1)}`;
  }
}

function jsPageBundle() {
  glob(paths.public.js.compile.pages, function(err, files) {
    files.forEach(function(file) {
      var bundleStream = browserify(file).bundle();
      bundleStream
        .pipe(source(`js/pages${file.slice(file.indexOf('pages') + 5)}`))
        .pipe(gulp.dest(paths.public.dist));
    });
  });
}

function onWatchError(err) {
  console.log(err.message);
  this.emit('end');
}
