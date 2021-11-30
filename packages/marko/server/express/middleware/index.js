const { jsonErrorHandler } = require('@parameter1/base-web-server-express/middleware');
const cleanMarkoResponse = require('./clean-marko-response');

const withContent = require('./with-content');
const withDynamicPage = require('./with-dynamic-page');
const withMagazineIssue = require('./with-magazine-issue');
const withMagazinePublication = require('./with-magazine-publication');
const withWebsiteSection = require('./with-website-section');

module.exports = {
  cleanMarkoResponse,
  jsonErrorHandler,
  // deprecated
  withContent,
  withDynamicPage,
  withMagazineIssue,
  withMagazinePublication,
  withWebsiteSection,
};
