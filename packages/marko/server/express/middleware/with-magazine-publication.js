const { deprecated } = require('@parameter1/base-web-marko-server-common/deprecate');
const magazinePublicationFromId = require('../route-handlers/magazine-publication-from-id');

module.exports = deprecated(({
  template,
  queryFragment,
} = {}) => magazinePublicationFromId({
  template,
  nodeQueryFragment: queryFragment,
}), 'middleware.withMagazinePublication', 'route-handlers.magazinePublicationFromId');
