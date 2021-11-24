const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');
const contentFromId = require('./content-from-id');

const withContent = require('./with-content');

module.exports = {
  jsonErrorHandler,
  contentFromId,
  // deprecated
  withContent,
};
