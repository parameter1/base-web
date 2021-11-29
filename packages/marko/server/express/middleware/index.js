const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');

const withContent = require('./with-content');
const withDynamicPage = require('./with-dynamic-page');
const withWebsiteSection = require('./with-website-section');

module.exports = {
  jsonErrorHandler,
  // deprecated
  withContent,
  withDynamicPage,
  withWebsiteSection,
};
