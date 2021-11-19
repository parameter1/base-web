const path = require('path');
const { renderSync } = require('sass');
const { createHash } = require('crypto');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const preset = require('cssnano-preset-default');
const { getProfileMS } = require('@parameter1/base-web-utils');
const del = require('del');
const makeDir = require('make-dir');
const { writeFile } = require('fs').promises;

const { log } = console;

/**
 * @todo ENSURE SOURCE MAPS ARE CORRECT!
 * @todo Write files and add to manifest
 * @todo needs to remove files it creates
 */
module.exports = async ({
  cwd,
  entry,
  sassOptions,
  postcssOptions,
  autoprefixerOptions,
  cssnanoOptions,
  hashLength = 8,
} = {}) => {
  const start = process.hrtime();
  log('Building sass...');
  await del('dist/css/**/*', { cwd });
  const file = path.resolve(cwd, entry);

  const rendered = renderSync({
    file,
    sourceMap: true,
    outFile: 'index.rendered.css',
    quietDeps: true,
    ...sassOptions,
  });
  log(`Sass built in ${getProfileMS(start)}ms (filesize: ${rendered.css.byteLength})`);

  const startPostCSS = process.hrtime();
  log('Running PostCSS...');
  const result = await postcss([
    cssnano({
      preset: preset(),
      plugins: [
        [autoprefixer, {
          overrideBrowserslist: [
            '>= 1%',
            'not dead',
            'last 1 major version',
            'Chrome >= 45',
            'Firefox >= 38',
            'Edge >= 12',
            'Explorer >= 11',
            'iOS >= 9',
            'Safari >= 9',
            'Android >= 4.4',
            'Opera >= 30',
          ],
          ...autoprefixerOptions,
        }],
      ],
      ...cssnanoOptions,
    }),
  ]).process(rendered.css, {
    from: 'index.rendered.css',
    to: 'index.prod.css',
    ...postcssOptions,
  });
  log(`PostCSS completed in ${getProfileMS(startPostCSS)}ms (filesize: ${result.css.length})`);
  const hash = createHash('sha1').update(result.css).digest('hex').substr(0, hashLength);

  log('Writing files to dist folder...');
  const getFileFor = (name) => path.resolve(cwd, 'dist/css', name);
  await makeDir(path.resolve(cwd, 'dist/css'));
  await Promise.all([
    writeFile(getFileFor(`index.${hash}.css`), rendered.css, { encoding: 'utf8' }),
    writeFile(getFileFor(`index.${hash}.css.map`), rendered.map, { encoding: 'utf8' }),
    writeFile(getFileFor('manifest.json'), JSON.stringify({ main: `index.${hash}.css` }), { encoding: 'utf8' }),
  ]);

  log(`CSS READY in ${getProfileMS(start)}ms with content hash ${hash}`);
};
