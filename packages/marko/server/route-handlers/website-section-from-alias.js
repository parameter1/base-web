const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { websiteSectionFromAlias } = require('@parameter1/base-web-server-express/route-handlers');

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
    const context = isFn(contextFn) ? await contextFn({
      req,
      res,
      section,
      pageNode,
    }) : {};
    res.marko(template, { ...section, pageNode, context });
  },

  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch,
  loaderQueryFragment,
});
