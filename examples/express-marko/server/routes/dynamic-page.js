const { dynamicPageFromAlias } = require('@parameter1/base-web-marko-server-express/route-handlers');
const queryFragment = require('../graphql/fragments/dynamic-page');
const page = require('../templates/dynamic-page.marko');

module.exports = (app) => {
  app.get('/page/:alias(*)', dynamicPageFromAlias({
    template: page,
    queryFragment,
  }));
};
