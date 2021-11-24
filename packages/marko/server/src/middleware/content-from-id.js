const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { contentFromId } = require('@parameter1/base-web-server-express/route-handlers');

module.exports = ({
  template,
  render,

  nodeQueryFragment,
  idResolver,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
  formatResponse,
} = {}) => contentFromId({
  render: isFn(render) ? render : async ({ res, node, content }) => {
    if (isFn(formatResponse)) await formatResponse({ res, content, pageNode: node });
    res.marko(template, { ...content, pageNode: node });
  },
  idResolver,
  nodeQueryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
});
