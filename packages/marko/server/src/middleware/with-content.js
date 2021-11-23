const { isFunction: isFn } = require('@parameter1/base-web-utils');
// @todo point to the new files and deprecate!
const { contentFromId } = require('@parameter1/base-web-server-express/route-handlers');

module.exports = ({
  template,

  queryFragment,
  idResolver,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  pathFn,
  formatResponse,
} = {}) => contentFromId({
  render: async ({ res, node, content }) => {
    if (isFn(formatResponse)) await formatResponse({ res, content, pageNode: node });
    res.marko(template, { ...content, pageNode: node });
  },
  idResolver,
  nodeQueryFragment: queryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn: pathFn,
});
