import babelify    from 'babelify'
import { create }  from 'browser-sync'
import browserify  from 'browserify'
import history     from 'connect-history-api-fallback'
import gulp        from 'gulp'
import cssnano     from 'gulp-cssnano'
import mocha       from 'gulp-mocha'
import sass        from 'gulp-sass'
import sourcemaps  from 'gulp-sourcemaps'
import uglify      from 'gulp-uglify'
import gutil       from 'gulp-util'
import runSequence from 'run-sequence'
import buffer      from 'vinyl-buffer'
import source      from 'vinyl-source-stream'
import watchify    from 'watchify'

const production = process.env.NODE_ENV === 'production';

const browserSync = create();

const bundler = browserify({
  entries: ['app/js/app.js'],
  cache: {},
  packageCache: {},
  plugin: [watchify],
  transform: [babelify],
  debug: true
})

bundler.on('update', () => {
  browserSync.notify('Compiling...');
  runSequence('bundle');
})

gulp.task('bundle', () => {
  return bundler.bundle()
    .on('error', err => {
      gutil.log(err.message);
      browserSync.notify(`bundler: ${err.message}`, 5000);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(production ? uglify() : gutil.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream({ once: true })) // restrict reloading browserSync to once per stream
})

gulp.task('sass', () => {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules/normalize.css']
    })
      .on('error', err => {
        gutil.log(err);
        browserSync.notify(`sass: ${err}`, 5000);
      }))
    .pipe(production ? cssnano() : gutil.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
})

gulp.task('browser-sync', done => {
  return browserSync.init({
    server: {
      baseDir: 'app',
      middleware: [ history() ]
    }
  }, done);
})

gulp.task('watch', ['sass', 'bundle', 'browser-sync'], () => {
  gulp.watch('app/scss/**/*.scss)', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
})

gulp.task('default', done => {
  runSequence(['sass', 'bundle', 'browser-sync', 'watch'], done);
})

gulp.task('test', () => {
  return gulp.src('test/**/*.js')
    .pipe(mocha());
})

gulp.task('test:watch', ['test'], () => {
  gulp.watch('app/js/**/*.js', ['test']);
  gulp.watch('test/**/*.spec.js', ['test']);
})
