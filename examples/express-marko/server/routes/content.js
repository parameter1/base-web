const { withContent } = require('@parameter1/base-web-marko-server-express/middleware');
const queryFragment = require('../graphql/fragments/content-page');
const template = require('../templates/content.marko');

module.exports = (server) => {
  server.get('/*?/:id(\\d{8})/*|/:id(\\d{8})(/|$)', withContent({
    template,
    queryFragment,
  }));
};
