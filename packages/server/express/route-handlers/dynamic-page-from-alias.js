const { dynamincPageRouteDataFromAlias } = require('@parameter1/base-web-server-common/route-data-loaders');
const { redirectWithQuery } = require('@parameter1/base-web-server-common/utils');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const asyncRoute = require('../utils/async-route');

module.exports = ({
  render,
  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => asyncRoute(async (req, res) => {
  const { baseCMSGraphQLClient } = req.app.locals;
  const { node, page, redirectTo } = await dynamincPageRouteDataFromAlias({
    baseCMSGraphQLClient,
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
      page,
    });
  }
  return { node, page };
});
