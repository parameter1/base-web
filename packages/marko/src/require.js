/* eslint-disable no-underscore-dangle */
require('marko');
const { readFileSync } = require('fs');
const { emitWarning } = require('process');
const compileSync = require('./compile/one-sync');

const encoding = 'utf8';

function emitCompileWarning() {
  if (!emitCompileWarning.warned) {
    emitCompileWarning.warned = true;
    emitWarning('Template(s) compiled on-the-fly. Preferably, all templates should be compiled before running the server.');
  }
}

require.extensions['.marko'] = (module, filename) => {
  const target = `${filename}.js`;
  if (process.env.MARKO_PREBUILT_TEMPLATES) {
    try {
      const content = readFileSync(target, { encoding });
      module._compile(content, target);
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error(`Marko is running in prebuilt template mode, but no compiled template was found for ${filename}`);
      }
      throw e;
    }
  } else {
    emitCompileWarning();
    compileSync(filename);
    module._compile(readFileSync(target, { encoding }), target);
  }
};
