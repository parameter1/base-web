const { getProfileMS } = require('@parameter1/base-web-utils');
const ForkServer = require('./fork-server');
const compileMarkoFiles = require('./compile-marko-files');
const watchFiles = require('./watch');

const { log } = console;

module.exports = async ({
  cwd,
  serverEntry,
  compileDirs,
  cleanCompiledFiles = false,
  additionalWatchDirs = [],
  abortOnInstanceError = false,
  showWatchedFiles = false,
} = {}) => {
  const start = process.hrtime();
  // compile any uncompiled or out-of-date marko templates before starting the server instance
  await compileMarkoFiles({ cwd, dirs: compileDirs, clean: cleanCompiledFiles });

  // fork and start the server instance
  log('Starting forked server...');
  const serverStart = process.hrtime();
  const server = ForkServer({
    cwd,
    entry: serverEntry,
    onAfterRestart: () => log('@todo Fire livereload hook!'),
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
  });
  log(`READY in ${getProfileMS(start)}ms`);
};
