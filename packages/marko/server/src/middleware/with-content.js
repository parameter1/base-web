const contentFromId = require('./content-from-id');
const { deprecated } = require('../deprecate');

module.exports = deprecated(({
  template,
  render,

  queryFragment,
  idResolver,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  pathFn,
  formatResponse,
} = {}) => contentFromId({
  template,
  render,
  nodeQueryFragment: queryFragment,
  idResolver,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn: pathFn,
  formatResponse,
}), 'middleware.withContent', 'middleware.contentFromId');
