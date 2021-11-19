const { getProfileMS } = require('@parameter1/base-web-utils');
const ForkServer = require('./fork-server');
const compileMarkoFiles = require('./compile-marko-files');
const watchFiles = require('./watch');
const createLivereload = require('./create-livereload');

const { log } = console;

module.exports = async ({
  cwd,
  serverEntry,
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
  // compile any uncompiled or out-of-date marko templates before starting the server instance
  await compileMarkoFiles({ cwd, dirs: compileDirs, clean: cleanCompiledFiles });

  const livereload = createLivereload();

  // fork and start the server instance
  log('Starting forked server...');
  const serverStart = process.hrtime();
  const server = ForkServer({
    cwd,
    entry: serverEntry,
    onReady: () => livereload.refresh('/'),
  });
  await server.listen({ rejectOnNonZeroExit: abortOnInstanceError });
  log(`Server fork started in ${getProfileMS(serverStart)}ms`);

  // enable file watching
  await watchFiles({
    server,
    cwd,
    additonalDirs: additionalWatchDirs,
    showFiles: showWatchedFiles,
    rejectOnNonZeroExit: abortOnInstanceError,
    ignore: watchIgnore,
  });
  log(`READY in ${getProfileMS(start)}ms`);
};
