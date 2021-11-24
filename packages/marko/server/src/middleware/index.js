const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');

const withContent = require('./with-content');
const withWebsiteSection = require('./with-website-section');

module.exports = {
  jsonErrorHandler,
  // deprecated
  withContent,
  withWebsiteSection,
};
