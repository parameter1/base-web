const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { contentFromId } = require('@parameter1/base-web-server-express/route-handlers');

const maybeDeprecate = (marko, data) => {
  if (!marko.get('compat.enabled')) return data;
  process.emitWarning('Directly accessing content props (id, type, name, etc) within templates is deprecated. Use input.routeData[prop] instead.', { code: 'compat:input.routeData[prop]', type: 'DeprecationWarning' });
  return { ...data.routeData, ...data };
};

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
    const { marko } = res.app.locals;
    if (isFn(formatResponse)) await formatResponse({ res, content, pageNode: node });
    res.marko(template, maybeDeprecate(marko, { routeData: content, pageNode: node }));
  },
  idResolver,
  nodeQueryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
});
