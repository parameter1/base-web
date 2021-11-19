const path = require('path');
const { fork } = require('child_process');
const livereload = require('livereload');

const { log } = console;

if (!process.env.LIVERELOAD_PORT) process.env.LIVERELOAD_PORT = 55893;

module.exports = ({ cwd, entry, onAfterRestart } = {}) => {
  let proc;

  const { LIVERELOAD_PORT } = process.env;
  const lrserver = livereload.createServer({ port: LIVERELOAD_PORT });
  log(`Livereload server listening on port ${LIVERELOAD_PORT}`);

  const file = path.resolve(cwd, entry);

  const kill = () => {
    if (proc) proc.kill();
  };

  const listen = async ({ rejectOnNonZeroExit = true } = {}) => {
    kill();
    proc = fork(file, [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
    return new Promise((resolve, reject) => {
      proc.on('message', (message) => {
        if (message.event === 'ready') {
          resolve();
          lrserver.refresh('/');
        }
      });
      proc.on('exit', (code) => {
        if (code && code !== 0 && rejectOnNonZeroExit) reject(new Error(`Forked process received a non-zero (${code}) exit code.`));
      });
    });
  };

  return {
    kill,
    listen,
    restart: async (...args) => {
      await listen(...args);
      if (typeof onAfterRestart === 'function') await onAfterRestart;
    },
  };
};
