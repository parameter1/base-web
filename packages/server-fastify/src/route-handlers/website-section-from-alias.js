import { websiteSectionRouteDataFromAlias } from '@parameter1/base-web-server-common/route-data-loaders';
import { redirectWithQuery } from '@parameter1/base-web-server-common/utils';
import { isFunction as isFn } from '@parameter1/base-web-utils';

export default ({
  render,
  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => async (req, reply) => {
  const { node, section, redirectTo } = await websiteSectionRouteDataFromAlias({
    graphqlClient: req.$baseCMSGraphQLClient,
    alias: isFn(aliasResolver) ? await aliasResolver({ req, reply }) : req.params.alias,
    requestPath: req.url,
    nodeQueryFragment,
    redirectOnPathMismatch,
    loaderQueryFragment,
  });
  if (redirectTo) {
    return reply.redirect(301, redirectWithQuery({ path: redirectTo, query: req.query }));
  }
  if (isFn(render)) {
    return render({
      req,
      reply,
      node,
      section,
    });
  }
  return { node, section };
};
