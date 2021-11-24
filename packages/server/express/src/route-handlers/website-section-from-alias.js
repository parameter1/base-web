const { websiteSectionFromAlias } = require('@parameter1/base-web-server-common/route-data-loaders');
const { redirectWithQuery } = require('@parameter1/base-web-server-common/utils');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const asyncRoute = require('../utils/async-route');

/**
 * @param {object} params
 * @param {function} params.render The render callback function
 */
module.exports = ({
  render,
  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => asyncRoute(async (req, res) => {
  const { node, section, redirectTo } = await websiteSectionFromAlias({
    baseCMSGraphQLClient: res.locals.baseCMSGraphQLClient,
    alias: isFn(aliasResolver) ? await aliasResolver({ req, res }) : req.params.alias,
    request: res.locals.request,
    nodeQueryFragment,
    redirectOnPathMismatch,
    loaderQueryFragment,
  });
  if (redirectTo) {
    return res.redirect(301, redirectWithQuery({ path: redirectTo, query: req.query }));
  }
  if (isFn(render)) {
    return render({
      req,
      res,
      node,
      section,
    });
  }
  return { node, section };
});
