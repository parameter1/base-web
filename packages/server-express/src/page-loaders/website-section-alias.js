import { loadWebsiteSectionPageByAlias } from '@parameter1/base-web-server-common/page-loaders';
import { redirectWithQuery } from '@parameter1/base-web-server-common/utils';
import { isFunction as isFn } from '@parameter1/base-web-utils';
import asyncRoute from '../utils/async-route.js';

/**
 * @param {object} params
 * @param {function} params.render The render callback function
 */
export default ({
  render,
  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => asyncRoute(async (req, res) => {
  const { node, section, redirectTo } = await loadWebsiteSectionPageByAlias({
    graphqlClient: req.$baseCMSGraphQLClient,
    alias: isFn(aliasResolver) ? await aliasResolver({ req, res }) : req.params.alias,
    requestPath: req.path,
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
