/* eslint-disable no-underscore-dangle */
require('marko');
const { readFileSync } = require('fs');
const compileSync = require('./compile/one-sync');

const encoding = 'utf8';

require.extensions['.marko'] = (module, filename) => {
  const target = `${filename}.js`;
  try {
    const content = readFileSync(target, { encoding });
    return module._compile(content, target);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // attempt to build from scratch using sync compile
      // preferably all templates should be built ahead of time so this can be skipped
      compileSync(filename);
      return module._compile(readFileSync(target, { encoding }), target);
    }
    throw e;
  }
};
