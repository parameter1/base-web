const path = require('path');
const { readFileSync } = require('fs');

const load = (file) => {
  // on product, just require the file so it's cached
  // eslint-disable-next-line global-require, import/no-dynamic-require
  if (process.env.NODE_ENV === 'production') return require(file);
  // otherwise, parse the file "live" so reloaded/new changes can be picked up.
  const json = readFileSync(file, { encoding: 'utf8' });
  return JSON.parse(json);
};

module.exports = ({ $conf, type }) => {
  const cwd = $conf.get('cwd');
  const file = path.resolve(cwd, 'dist', type, 'manifest.json');
  const manifest = load(file);
  return `/dist/css/${manifest.main}`;
};
