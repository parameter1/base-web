const { unlink } = require('fs').promises;
const findFiles = require('./find-files');

/**
 *
 * @param {string} cwd The current working directory
 * @param {object} options
 * @param {string[]} [options.dirs=[]] Additional directories to remove files from
 */
module.exports = async (cwd, { dirs = [] }) => {
  const entries = await findFiles(cwd, { dirs, compiled: true });
  await Promise.all(entries.map(({ path }) => unlink(path)));
};
