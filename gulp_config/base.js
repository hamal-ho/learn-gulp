const minimist = require('minimist');

const { writeFile, readFile, mkdir } = require('fs');
const { promisify } = require('util');

const knownOptions = {
  string: ['name', 'page'],
  default: { name: 'my-page', page: 'my-page' }
};

exports.options = minimist(process.argv.slice(2), knownOptions);
exports.writeFile = promisify(writeFile);
exports.readFile = promisify(readFile);
exports.mkdir = promisify(mkdir);
