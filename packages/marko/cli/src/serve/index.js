const { getProfileMS } = require('@parameter1/base-web-utils');
const ForkServer = require('./fork-server');
const compileMarkoFiles = require('./compile-marko-files');
const watchFiles = require('./watch');
const createLivereload = require('./create-livereload');
const buildCSS = require('../css');

const { log } = console;

module.exports = async ({
  cwd,
  entries = {},
  compileDirs,
  cleanCompiledFiles = false,
  additionalWatchDirs = [],
  watchIgnore = [],
  abortOnInstanceError = false,
  showWatchedFiles = false,
  forceRequirePrebuiltTemplates = true,
} = {}) => {
  const start = process.hrtime();
  if (forceRequirePrebuiltTemplates) process.env.MARKO_REQUIRE_PREBUILT_TEMPLATES = true;
  await Promise.all([
    // compile any uncompiled or out-of-date marko templates before starting the server instance
    compileMarkoFiles({ cwd, dirs: compileDirs, clean: cleanCompiledFiles }),
    // build css
    buildCSS({ cwd, entry: entries.styles }),
  ]);

  const livereload = createLivereload();

  // fork and start the server instance
  log('Starting forked server...');
  const serverStart = process.hrtime();
  const server = ForkServer({
    cwd,
    entry: entries.server,
    onReady: () => livereload.refresh('/'),
  });
  await server.listen({ rejectOnNonZeroExit: abortOnInstanceError });
  log(`Server fork started in ${getProfileMS(serverStart)}ms`);

  // enable file watching
  await watchFiles({
    server,
    cwd,
    entries,
    livereload,
    additonalDirs: additionalWatchDirs,
    showFiles: showWatchedFiles,
    rejectOnNonZeroExit: abortOnInstanceError,
    ignore: watchIgnore,
  });
  log(`READY in ${getProfileMS(start)}ms`);
};
