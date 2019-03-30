const { options, writeFile, mkdir } = require('./base');

async function add_page(cb) {
  const path = `src/${options.name}`;
  const files = ['.js', '.scss', '.html'];
  await mkdir(path, {
    recursive: true
  });
  const writes = [];
  for (const item of files) {
    const url = `${path}/${options.name}${item}`;
    const temp = writeFile(url, '').then(() => {
      console.info(`创建${url}`);
    });
    writes.push(temp);
  }
  await Promise.all(writes);
  cb();
}
exports.add_page = add_page;
