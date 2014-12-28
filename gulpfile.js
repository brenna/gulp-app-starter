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
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.reload({stream:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
    .pipe(notify({message: 'styles compiled!'}));
});

gulp.task('jshint', function(){
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({message: 'ur js is a-ok'}));
});

//compile scripts with browserify
gulp.task('scripts', function(){
  var browserified = transform(function(filename){
      var b = browserify(filename);
      return b.bundle();
  });

  return gulp.src(['./app/js/main.js'])
    .pipe(browserified)
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(notify({message: 'scripts compiled'}));
});

gulp.task('html', function(){
  return gulp.src('app/*.html')
    .pipe(preprocess())
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function(){
  browsersync({
    server: {
      baseDir: "./dist/"
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

//production build task (includes links to minified files)
gulp.task('build', ['clean'], function(){
  gulp.start('styles', 'jshint', 'scripts', 'html');
  return gulp.src('app/*.html')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['clean'], function(){
  gulp.start('browser-sync', 'styles', 'jshint', 'scripts', 'html', 'watch');
});
