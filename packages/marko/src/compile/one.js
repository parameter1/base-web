const path = require('path');
const { readFile, writeFile, rename } = require('fs').promises;
const { getProfileMS } = require('@parameter1/base-web-utils');
const runCompile = require('./run');
const stat = require('../utils/stat');

const encoding = 'utf8';
const { log, warn } = console;

const needsCompilation = async ({ templateFile, compiledFile, force }) => {
  if (force) return true;
  const compiledStats = await stat.async(compiledFile, { throwOnNotFound: false });
  if (!compiledStats) return true;
  const templateStats = await stat.async(templateFile);
  return compiledStats.mtime < templateStats.mtime;
};

const compile = async ({ templateFile, compilerOptions } = {}) => {
  try {
    const templateSrc = await readFile(templateFile, { encoding });
    return runCompile({ templateSrc, templateFile, compilerOptions });
  } catch (e) {
    if (/unrecognized tag/i.test(e.message)) {
      const [compileError] = e.errors;
      const message = `Unrecognized tag encountered: ${compileError.node.tagName}`;
      warn(`WARNING: compilation of ${templateFile} skipped. ${message}`);
      return null;
    }
    throw e;
  }
};

module.exports = async (templateFile, {
  force = false,
  debug = false,
  tempFile = false,
  compilerOptions,
} = {}) => {
  let start;
  if (debug) start = process.hrtime();
  if (!path.isAbsolute(templateFile)) throw new Error('Marko template files must be absolute.');
  const compiledFile = `${templateFile}.js`;

  const shouldCompile = await needsCompilation({ templateFile, compiledFile, force });
  if (!shouldCompile) return;

  const compiled = await compile({ templateFile, compilerOptions });
  if (!compiled) return;
  if (tempFile) {
    const tempFilePath = path.join(path.dirname(templateFile), `.${process.pid}.${Date.now()}.${path.basename(compiledFile)}`);
    await writeFile(tempFilePath, compiled.code, { encoding });
    await rename(tempFilePath, compiledFile);
  } else {
    await writeFile(compiledFile, compiled.code, { encoding });
  }
  if (debug) log(`Compiled Marko template ${templateFile} in ${getProfileMS(start)}ms`);
};
