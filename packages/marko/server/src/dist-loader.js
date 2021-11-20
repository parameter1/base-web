const path = require('path');
const { readFileSync } = require('fs');

const isDevelopment = process.env.NODE_ENV === 'development';

const loadFromManifest = ({ conf, type }) => {
  const cwd = conf.get('cwd');
  const file = path.resolve(cwd, 'dist', type, 'manifest.json');
  const json = readFileSync(file, { encoding: 'utf8' });
  const manifest = JSON.parse(json);
  const key = type === 'js' ? 'main.js' : 'main';
  return `/dist/${type}/${manifest[key]}`;
};

module.exports = ({ conf, type }) => {
  let file;
  return () => {
    // when on dev, always return the file from the manifest
    // as it may have changed during build.
    if (isDevelopment) return loadFromManifest({ conf, type });
    // otherwise, only retrieve it once
    if (!file) file = loadFromManifest({ conf, type });
    return file;
  };
};
