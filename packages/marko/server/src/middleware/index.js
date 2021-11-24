const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');
const { contentFromId } = require('@parameter1/base-web-server-express/route-handlers');
const withContent = require('./with-content');

module.exports = {
  jsonErrorHandler,
  contentFromId,
  // deprecated
  withContent,
};
