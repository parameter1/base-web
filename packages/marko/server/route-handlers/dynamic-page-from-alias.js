const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { dynamicPageFromAlias } = require('@parameter1/base-web-server-express/route-handlers');

const maybeDeprecate = (marko, data) => {
  if (!marko.get('compat.enabled')) return data;
  process.emitWarning('Directly accessing content page props (id, alias, etc) within templates is deprecated. Use input.routeData[prop] instead.', { code: 'compat:input.routeData[prop]', type: 'DeprecationWarning' });
  return { ...data.routeData, ...data };
};

module.exports = ({
  template,
  render,

  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => dynamicPageFromAlias({
  render: isFn(render) ? render : async ({
    req,
    res,
    node: pageNode,
    page,
  }) => {
    const { marko } = req.app.locals;
    res.marko(template, maybeDeprecate(marko, {
      routeData: page,
      pageNode,
    }));
  },

  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
});
