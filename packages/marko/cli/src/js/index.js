const path = require('path');
const webpack = require('webpack');
const { getProfileMS, isFunction: isFn } = require('@parameter1/base-web-utils');
const del = require('del');
const makeDir = require('make-dir');
const { browser } = require('./webpack.config');

const { log } = console;
const { emitWarning } = process;

module.exports = async ({
  cwd,
  entry,
  watch = false,
  onFileChange,
} = {}) => {
  let watchStarted = false;
  const start = process.hrtime();
  log('Building transpiled browser scripts...');

  const compiler = webpack(browser({ cwd, entry }));
  await makeDir(path.resolve(cwd, 'dist/js'));
  await del('dist/js/*', { cwd });

  if (watch) {
    await new Promise((resolve, reject) => {
      compiler.watch({
        ignored: /node_modules/,
      }, (err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err || stats.toJson().errors);
        } else {
          const s = stats.toJson('minimal');
          if (watchStarted) {
            log(`Transpiled browser scripts built in ${s.time}ms to ${s.assetsByChunkName.main}`);
            if (isFn(onFileChange)) onFileChange();
            if (s.warnings.length) emitWarning(`Webpack warnings found: ${s.warnings.join('\n')}`);
          }
          if (!watchStarted) watchStarted = true;
          resolve(stats);
        }
      });

      // console.log(watcher.o)
    });
  } else {
    await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err || stats.toJson().errors);
        } else {
          resolve(stats);
        }
      });
    });
  }

  log(`Transpiled browser scripts complete${watch ? ' and watching' : ''} in ${getProfileMS(start)}ms`);
};
