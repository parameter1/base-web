const fg = require('fast-glob');

const extensionPattern = '**/*.marko';

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
