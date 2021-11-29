const path = require('path');
const { readFileSync } = require('fs');

const loadFromManifest = ({ conf, type }) => {
  const cwd = conf.get('cwd');
  const file = path.resolve(cwd, 'dist', type, 'manifest.json');
  const json = readFileSync(file, { encoding: 'utf8' });
  const manifest = JSON.parse(json);
  const key = `main.${type}`;
  const fileName = manifest[key];
  if (!fileName) throw new Error(`Unable to extract a file name for type ${type} using manifest key ${key}`);
  return `/dist/${type}/${manifest[key]}`;
};

module.exports = ({ conf, type }) => {
  let file;
  const isDevelopment = conf.get('env') === 'development';
  return () => {
    // when on dev, always return the file from the manifest
    // as it may have changed during build.
    if (isDevelopment) return loadFromManifest({ conf, type });
    // otherwise, only retrieve it once
    if (!file) file = loadFromManifest({ conf, type });
    return file;
  };
};
