const { withWebsiteSection } = require('@parameter1/base-web-marko-server-express/middleware');
const queryFragment = require('../graphql/fragments/website-section-page');
const template = require('../templates/website-section.marko');

module.exports = (server) => {
  server.get('/:alias([a-z0-9-/]+)', withWebsiteSection({
    template,
    queryFragment,
  }));
};
