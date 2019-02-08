const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const plumber = require("gulp-plumber");
const uglify = require("gulp-uglify");
const fs = require('fs-extra');

const distDir = 'dist';
const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'ie_mob >= 11',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const minifyHTML = () => {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true,
      removeComments: true,
      ignoreCustomFragments: [/{{[{]?(.*?)[}]?}}/]
    }))
    .pipe(gulp.dest(distDir));
};

const minifyCSS = () => {
  return gulp.src('./src/**/*.css')
    .pipe(plumber())
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(csso())
    .pipe(gulp.dest(distDir));
};

const minifyJS = () => {
  return gulp.src('./src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(distDir));
};

const build = (done) => {
  return gulp.series(minifyHTML, minifyCSS, minifyJS)(done);
};

const clean = (done) => {
  if (fs.existsSync(distDir))
    fs.removeSync(distDir);
  fs.mkdirSync(distDir);
  return done();
};


function defaultTask() {
  return gulp.series(clean, build);
}

exports.clean = clean;
exports.build = build;
exports.default = defaultTask;
