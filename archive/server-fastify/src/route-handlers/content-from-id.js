import { contentRouteDataFromId } from '@parameter1/base-web-server-common/route-data-loaders';
import { redirectWithQuery } from '@parameter1/base-web-server-common/utils';
import { isFunction as isFn } from '@parameter1/base-web-utils';
import contentPreviewModeEnabled from '../utils/content-preview-enabled.js';

export default ({
  render,
  idResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
} = {}) => async (req, res) => {
  const { path } = req.urlData();
  const { node, content, redirectTo } = await contentRouteDataFromId({
    graphqlClient: req.$baseCMSGraphQLClient,
    id: isFn(idResolver) ? await idResolver({ req, res }) : req.params.id,
    requestPath: path,
    nodeQueryFragment,
    previewMode: contentPreviewModeEnabled({ req }),
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
};
