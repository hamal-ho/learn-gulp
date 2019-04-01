const gulpConfig = require('./gulp_config');

const { options, writeFile, readFile } = require('./gulp_config/base');

exports.addTask = async cd => {
  const { name } = options;
  const template = `
  function ${name}(cd) {
    cd();
  }
  exports.${name} = ${name};
  `;

  writeFile(`gulp_config/${name}.js`, template);

  const index = await readFile('gulp_config/index.js', {
    encoding: 'utf8'
  });

  writeFile(
    `gulp_config/index.js`,
    `const {${name}} = require('./${name}');${index}exports.${name} = ${name};`
  );

  const gulpfile = await readFile('gulpfile.js', {
    encoding: 'utf8'
  });

  writeFile(`gulpfile.js`, `${gulpfile}exports.${name} = gulpConfig.${name};`);

  cd();
};

exports.add_page = gulpConfig.add_page;
exports.watch_page = gulpConfig.watch_page;