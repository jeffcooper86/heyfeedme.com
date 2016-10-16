const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const csscomb = require('gulp-csscomb');
const cssmin = require('gulp-cssmin');
const diff = require('gulp-diff');
const es = require('event-stream');
const foreach = require('gulp-foreach');
const glob = require('glob');
const gulp = require('gulp');
const jsPrettify = require('gulp-jsbeautifier');
const less = require('gulp-less');
const source = require('vinyl-source-stream');

const utils = require(process.cwd() + '/utils/global.js');


/**
 * Main tasks.
 */
gulp.task('default', ['dist']);
gulp.task('beautify', ['beautify:js', 'beautify:less']);
gulp.task('beautifyCheck', ['beautify:jsCheck', 'beautify:less']);
gulp.task('dist', ['dist:less', 'dist:js', 'dist:jsPages']);
gulp.task('watch', ['watch:less', 'watch:js']);


/**
 * Config.
 */
const paths = {
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


/**
 * Build tasks.
 */
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
  return bundleStream
    .pipe(source('main.js'))
    .pipe(gulp.dest(`${paths.public.dist}js/`));
});

gulp.task('dist:jsPages', function() {
  return jsPageBundle();
});


/**
 * Watch tasks.
 */
gulp.task('watch:less', function() {
  return gulp.watch(paths.public.less.watch, ['dist:less']);
});

gulp.task('watch:js', function() {
  return gulp.watch(paths.public.js.watch, ['dist:js']);
});


/**
 * Beautifiers.
 */
gulp.task('beautify:js', function() {
  return beautifyJs();
});

gulp.task('beautify:jsCheck', function() {
  return beautifyJs(true);
});

gulp.task('beautify:less', function() {
  return beautifyLess();
});

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
