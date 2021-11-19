const fg = require('fast-glob');

const extensionPattern = '**/*.marko';

/**
 *
 * @param {string} cwd The current working directory
 * @param {object} options
 * @param {string[]} [options.dirs=[]] Additional directories to find files in
 * @param {boolean} [options.stats=false] Whether to include stats with the found files
 * @param {boolean} [options.compiled=false] Whether to only return compiled files.
 *                                           Otherwise template files are returned (default).
 * @param {string[]} [options.ignorePackages=[]] Package names to ignore
 * @param {...object} [options.rest] Additional options to pass to fast-glob
 */
module.exports = async (cwd, {
  dirs = [],
  stats = false,
  compiled = false,
  ignorePackages = [],
  ...rest
} = {}) => {
  const suffix = compiled ? `${extensionPattern}.js` : extensionPattern;
  const patterns = [
    `./${suffix}`,
    ...dirs.map((dir) => `${dir}/${suffix}`),
  ];
  const entries = await fg(patterns, {
    ...rest,
    cwd,
    absolute: true,
    stats,
    objectMode: true,
    ignore: [
      ...ignorePackages.map((name) => `**/${name}/${suffix}`),
    ],
  });
  if (entries.some(({ dirent }) => dirent.isDirectory())) {
    throw new Error('Directories are not supported.');
  }
  return entries;
};
