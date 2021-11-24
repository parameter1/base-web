const helmet = require('helmet');

module.exports = ({ server, conf } = {}) => {
  const { enabled, ...options } = conf.getAsObject('helmet');
  if (!enabled) return;
  server.use(helmet(options));
};
