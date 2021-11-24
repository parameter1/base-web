const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { contentFromId } = require('@parameter1/base-web-server-express/route-handlers');
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
  render: isFn(render) ? render : async ({ res, node, content }) => {
    if (isFn(formatResponse)) await formatResponse({ res, content, pageNode: node });
    res.marko(template, { ...content, pageNode: node });
  },
  idResolver,
  nodeQueryFragment: queryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn: pathFn,
}), 'middleware.withContent', 'middleware.contentFromId');
