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

var paths = {
  js: ['./*.js', './routes/**/*.js', './utils/**/*.js', './models/**/*.js'],
  public: {
    dist: './public/dist/',
    less: {
      compile: ['./public/styles/site.less'],
      watch: ['./public/styles/**/*.less']
    },
    js: {
      compile: ['./public/js/main.js'],
      watch: ['./public/js/**/*.js']
    }
  }
};

gulp.task('default', ['dist']);

// Build tasks
gulp.task('dist:less', function() {
  return gulp.src(paths.public.less.compile)
    .pipe(less({}))
    .on('error', onWatchError)
    .pipe(autoprefixer({
      browsers: ['> 5%']
    }))
    .pipe(gulp.dest(paths.public.dist + 'styles/'));
});

gulp.task('dist:js', function() {
  var bundleStream = browserify(paths.public.js.compile).bundle();
  bundleStream
    .pipe(source('main.js'))
    .pipe(gulp.dest(paths.public.dist + 'js/'));
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

function onWatchError(err) {
  console.log(err.message);
  this.emit('end');
}
