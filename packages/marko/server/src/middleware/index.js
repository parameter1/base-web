const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');

const withContent = require('./with-content');

module.exports = {
  jsonErrorHandler,
  // deprecated
  withContent,
};
