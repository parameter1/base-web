const { withWebsiteSection } = require('@parameter1/base-web-marko-server-express/middleware');
const queryFragment = require('../graphql/fragments/website-section-page');
const template = require('../templates/index.marko');

module.exports = (server) => {
  server.get('/', withWebsiteSection({
    aliasResolver: () => 'home',
    template,
    queryFragment,
  }));
};
