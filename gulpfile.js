var gulp = require('gulp'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    del = require('del'),
    preprocess = require('gulp-preprocess'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css')
    autoprefix = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    browsersync = require('browser-sync'),
    notify = require('gulp-notify');

//compile scss and autoprefix
//outputs an expanded version with sourcemap and minified version
gulp.task('styles', function(){
  return gulp.src('app/css/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      onError: function(err){
        return notify().write(err);
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.reload({stream:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('jshint', function(){
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify(function(file){
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");

      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});

//compile scripts with browserify
gulp.task('scripts', function(){
  var browserified = transform(function(filename){
      var b = browserify(filename, {debug: true});
      return b.bundle();
  });

  return gulp.src(['./app/js/main.js'])
    .pipe(browserified)
    .on('error', function(err){
      return notify().write(err.message);
    })
    .pipe(gulp.dest('./dist/js'))
    .pipe(browsersync.reload({stream:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
    .pipe(preprocess())
    .pipe(browsersync.reload({stream:true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function(){
  browsersync({
    startPath: '/dist/',
    server: {
      baseDir: "./"
    }
  })
});

gulp.task('watch', function(){
  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['jshint', 'scripts']);
  gulp.watch('app/**/*.html', ['html']);
});

gulp.task('clean', function(cb) {
    del('dist/*', cb);
});

//production build task (generates links to minified files)
gulp.task('build', ['clean'], function(){
  gulp.start('styles', 'jshint', 'scripts', 'html');
  return gulp.src('app/*.html')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['clean'], function(){
  gulp.start('browser-sync', 'styles', 'jshint', 'scripts', 'html', 'watch');
});
