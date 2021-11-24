const { createVersionsHeader } = require('@parameter1/base-web-server-common/config');

module.exports = ({ server, conf, pkg } = {}) => {
  server.use((_, res, next) => {
    res.set(...createVersionsHeader({ conf, pkg }));
    next();
  });
};
