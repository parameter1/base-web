const contentFromId = require('../route-handlers/content-from-id');
const { deprecated } = require('../deprecate');

module.exports = deprecated(({
  template,
  queryFragment,
  idResolver,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  pathFn,
  formatResponse,
} = {}) => contentFromId({
  template,
  nodeQueryFragment: queryFragment,
  idResolver,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn: pathFn,
  formatResponse,
}), 'middleware.withContent', 'route-handlers.contentFromId');
