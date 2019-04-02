const { watch, parallel, series } = require('gulp');
const { options, readFile } = require('./base');
const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const { obj } = require('through2');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const rev = require('gulp-rev-append');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlbeautify = require('gulp-html-beautify');
const del = require('del');

function clean() {
  return del(['dist']);
}

async function copyHtml(cb) {
  const temp = await readFile(`src/main/main.html`, {
    encoding: 'utf8'
  });
  // console.log(temp, '=====temp');
  const main = temp.split('</body>');

  let pageName = '';
  src([`src/**/*.html`, '!src/main/main.html'])
    .pipe(
      rename(path => {
        path.dirname = '';
        pageName = path.basename;
      })
    )
    .pipe(
      obj(function(file, encode, cb) {
        const content = file.contents.toString(encode);
        const p = `${main[0]}<link rel="stylesheet" href="statics/css/main.css">
        <link rel="stylesheet" href="statics/css/${pageName}.css">
        ${content}<script src="statics/js/main.js"></script>
        <script src="statics/js/${pageName}.js"></script>
        </body>${main[1]}`;
        file.contents = Buffer.from(p);
        this.push(file);
        cb();
      })
    )
    .pipe(htmlbeautify({ indentSize: 2 }))

    .pipe(dest(`dist`));
  cb();
}

function copyCss(cb) {
  src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(
      rename(path => {
        path.dirname = '';
      })
    )
    .pipe(dest(`dist/statics/css`));
  cb();
}

function copyJs(cb) {
  src('src/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(uglify())
    .pipe(
      rename(path => {
        path.dirname = '';
      })
    )
    .pipe(dest(`dist/statics/js`));
  cb();
}

function copyAssets(cb) {
  src(`src/assets/**`).pipe(dest(`dist/statics`));
  cb();
}

exports.build = series(clean, parallel(copyAssets, copyJs, copyCss, copyHtml));
