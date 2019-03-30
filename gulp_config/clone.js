const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const css = require('gulp-clean-css');
const { options, readFile, writeFile } = require('./base');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

function copyCss(cb) {
  const path = `src/${options.page}/${options.page}`;
  src(`${path}.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(css())
    .pipe(dest('src/assets/style/'));
  cb();
}

function copyJs(cb) {
  src(`src/${options.page}/${options.page}.js`)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat(`${options.page}.js`))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('src/assets/script/'));

  cb();
}

async function clone(cd) {
  const path = `src/${options.page}/${options.page}`;

  const [main, page] = await Promise.all([
    readFile('src/main/main.html', {
      encoding: 'utf8'
    }),
    readFile(`${path}.html`, {
      encoding: 'utf8'
    })
  ]);

  const data = main.split('<!--page-->');

  const template = `<link rel="stylesheet" href="../assets/style/${
    options.page
  }.css" />${page}
   <script src="../assets/script/${options.page}.js"></script>
   `;

  const html = data[0].concat(template, data.pop());

  writeFile('src/index/index.html', html);

  cd();
}

exports.clone = parallel(clone, copyJs, copyCss);
