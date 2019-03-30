const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const css = require('gulp-clean-css');

const babel = require('gulp-babel');
const concat = require('gulp-concat');
function updateCss(cb) {
  src('src/main/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(css())
    .pipe(dest('src/assets/style/'));
  cb();
}

function updateJs(cb) {
  src('src/main/main.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('src/assets/script/'));

  cb();
}
exports.update_main = parallel(updateCss, updateJs);
