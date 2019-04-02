const {build} = require('./build');const {watch_page} = require('./watch_page');const { update_main } = require('./update_main');
const { add_page } = require('./add_page');
const { clone } = require('./clone');

exports.clone = clone;
exports.add_page = add_page;
exports.update_main = update_main;
exports.watch_page = watch_page;exports.build = build;