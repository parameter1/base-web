const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { websiteSectionFromAlias } = require('@parameter1/base-web-server-express/route-handlers');

const maybeDeprecate = (marko, data) => {
  if (!marko.get('compat.enabled')) return data;
  process.emitWarning('Directly accessing section props (id, alias, name, etc) within templates is deprecated. Use input.routeData[prop] instead.', { code: 'compat:input.routeData[prop]', type: 'DeprecationWarning' });
  return { ...data.routeData, ...data };
};

module.exports = ({
  template,
  render,

  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  contextFn,
} = {}) => websiteSectionFromAlias({
  render: isFn(render) ? render : async ({
    req,
    res,
    node: pageNode,
    section,
  }) => {
    const { marko } = req.app.locals;
    const context = isFn(contextFn) ? await contextFn({
      req,
      res,
      section,
      pageNode,
    }) : {};
    res.marko(template, maybeDeprecate(marko, {
      routeData: section,
      pageNode,
      context,
    }));
  },

  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
});
