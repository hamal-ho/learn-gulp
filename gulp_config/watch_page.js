const { watch, parallel, series } = require('gulp');
const { options, readFile } = require('./base');
const { src, dest } = require('gulp');
const rename = require('gulp-rename');
const { obj } = require('through2');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const css = require('gulp-clean-css');
const browsersync = require('browser-sync').create();
const rev = require('gulp-rev-append');

// BrowserSync
function BrowserSync(done) {
  browsersync.init({
    server: {
      baseDir: 'www'
    },
    port: 3100
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function transCss() {
  return src([`src/main/*.scss`, `src/${options.page}/${options.page}.scss`])
    .pipe(
      concat(`all.scss`),
      { newLine: `/* ${options.page} */` }
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(css())
    .pipe(rename('index.css'))
    .pipe(rev())
    .pipe(dest(`www`))
    .pipe(browsersync.stream());
}

async function transHtml() {
  const temp = await readFile(`src/${options.page}/${options.page}.html`);
  return src(`src/main/*.html`)
    .pipe(
      obj(function(file, encode, cb) {
        const content = file.contents.toString(encode).split('</body>');

        const p = `${
          content[0]
        }<link rel="stylesheet" href="index.css">${temp}<script src="index.js"></script></body>${
          content[1]
        }`;
        file.contents = Buffer.from(p);
        this.push(file);
        cb();
      })
    )
    .pipe(rename('index.html'))
    .pipe(rev())
    .pipe(dest(`www`))
    .pipe(browsersync.stream());
}

function transScript() {
  return src([`src/main/*.js`, `src/${options.page}/${options.page}.js`])
    .pipe(
      concat(`all.js`),
      { newLine: `/* ${options.page} */` }
    )
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(rename('index.js'))
    .pipe(rev())
    .pipe(dest(`www`))
    .pipe(browsersync.stream());
}

function listenr(cb) {
  watch(
    [`src/main/*.js`, `src/${options.page}/${options.page}.js`],
    transScript
  );
  watch(
    [`src/main/*.scss`, `src/${options.page}/${options.page}.scss`],
    transCss
  );
  watch(
    [`src/main/*.html`, `src/${options.page}/${options.page}.html`],
    transHtml
  );

  watch('www/*', browserSyncReload);

  cb();
}

function copyAssets(cb) {
  src(`src/assets/**`).pipe(dest(`www/assets`));
  cb();
}

exports.watch_page = series(
  parallel(copyAssets, transScript, transHtml, transCss),
  series(listenr, BrowserSync)
);
