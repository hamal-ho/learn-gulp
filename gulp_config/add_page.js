const { options, writeFile, mkdir, readFile } = require('./base');

function createJS() {
  const template = `// ${options.name} js`;
  return writeFile(`src/${options.name}/${options.name}.js`, template);
}
function createCSS() {
  // const template = `@import "../main/main.scss";`;
  return writeFile(
    `src/${options.name}/${options.name}.scss`,
    `// ${options.name}.scss`
  );
}

async function createHTML() {
  // const html = await readFile('src/main/main.html', {
  //   encoding: 'utf8'
  // });
  // const temp = html.split('</body>');
  // const template = `${temp[0]}
  // <script src="../main/main.js"></script>
  // <script src="./${options.name}.js"></script>
  // </body>
  // ${temp[1]}`;

  return writeFile(
    `src/${options.name}/${options.name}.html`,
    `<!-- ${options.name} html -->`
  );
}

async function add_page(cb) {
  await mkdir(`src/${options.name}`, {
    recursive: true
  });
  await Promise.all([createHTML(), createCSS(), createJS()]);
  cb();
}
exports.add_page = add_page;
