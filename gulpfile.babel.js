// TODO use env variables: dev,...

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require("gulp-concat");
const gls = require('gulp-live-server');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const del = require('del');

const paths = {
  base: `${__dirname}/src/front`,
  src: {
    base: `${__dirname}/src/front/js`,
    copy: ['./src/front/*.html', './src/front/favicon.ico'],
    copyCss: './src/front/css/*.css',
    copyData: './src/front/data/*',
    back: './src/back/*.js',
    entry: './src/front/js/main.js',
    js: './src/front/js/**/*.{js,jsx}'
  },
  dest: {
    back: './back',
    server: './back/server.js',
    app: 'app.js',
    dist: './dist'
  }
};

gulp.task('copy-root', () => gulp.src(paths.src.copy).pipe(gulp.dest(paths.dest.dist)));
gulp.task('copy-css', () => gulp.src(paths.src.copyCss, {base: paths.base}).pipe(gulp.dest(paths.dest.dist)));
gulp.task('copy-data', () => gulp.src(paths.src.copyData, {base: paths.base}).pipe(gulp.dest(paths.dest.dist)));
gulp.task('copy', ['copy-root', 'copy-css', 'copy-data']);

gulp.task('build-front-js', () =>
  browserify({entries: paths.src.entry, debug: true})
    .transform(babelify.configure({
      optional: ['es7.decorators']
    }))
    .bundle()
    .pipe(source(paths.dest.app))
    .pipe(gulp.dest(paths.dest.dist))
);

gulp.task('build-back', () =>
  gulp.src(paths.src.back)
    .pipe(babel())
    .pipe(gulp.dest(paths.dest.back))
);

// Node doesn't yet support template strings...
// gls.new(['--harmony', './src/back/server.js']).start();
let server;
gulp.task('serve', () => {
  server = gls.new(paths.dest.server);
  server.start();
});

gulp.task('watch', () => {
  gulp.watch([].concat(paths.src.js), ['build-front-js']);
  gulp.watch([].concat(paths.src.copy), ['copy']);
  gulp.watch([].concat(paths.src.back), ['build-back'], () => server.start());
});

gulp.task('clean', cb => del([paths.dest.dist, paths.dest.back], cb));

gulp.task('build', ['build-front-js', 'copy', 'build-back']);

gulp.task('default', ['build', 'watch', 'serve']);

