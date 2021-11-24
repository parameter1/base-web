const { contentRouteDataFromId } = require('@parameter1/base-web-server-common/route-data-loaders');
const { redirectWithQuery } = require('@parameter1/base-web-server-common/utils');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const asyncRoute = require('../utils/async-route');

module.exports = ({
  render,
  idResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
} = {}) => asyncRoute(async (req, res) => {
  const { baseCMSGraphQLClient } = req.app.locals;
  const { node, content, redirectTo } = await contentRouteDataFromId({
    baseCMSGraphQLClient,
    id: isFn(idResolver) ? await idResolver({ req, res }) : req.params.id,
    request: res.locals.request,
    nodeQueryFragment,
    previewMode: res.locals.contentPreviewModeEnabled,
    redirectOnPathMismatch,
    loaderQueryFragment,
    redirectToFn,
    canonicalPathFn,
  });
  if (redirectTo) {
    return res.redirect(301, redirectWithQuery({ path: redirectTo, query: req.query }));
  }
  if (isFn(render)) {
    return render({
      req,
      res,
      node,
      content,
    });
  }
  return { node, content };
});
