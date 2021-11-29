const { deprecated } = require('@parameter1/base-web-marko-server-common/deprecate');
const contentFromId = require('../route-handlers/content-from-id');

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
