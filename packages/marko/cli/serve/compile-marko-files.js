const { getProfileMS } = require('@parameter1/base-web-utils');
const compile = require('@parameter1/base-web-marko-lib/compile');
const { deleteCompiledFiles } = require('@parameter1/base-web-marko-lib/utils');

const { log } = console;

module.exports = async ({ cwd, dirs, clean } = {}) => {
  if (clean) {
    log('Deleting all compiled Marko templates...');
    await deleteCompiledFiles(cwd, { dirs });
    log('Compiled templates deleted');
  }
  log('Compiling Marko templates...');
  const start = process.hrtime();
  await compile.all(cwd, { dirs });
  log(`Marko templates compiled in ${getProfileMS(start)}ms`);
};
