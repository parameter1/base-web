import { loadWebsiteSectionPageByAlias } from '@parameter1/base-web-server-common/page-loaders';
import { redirectWithQuery } from '@parameter1/base-web-server-common/utils';
import { isFunction as isFn } from '@parameter1/base-web-utils';

export default ({
  render,
  aliasResolver,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderAdditionalInput,
  loaderQueryFragment,
} = {}) => async (req, reply) => {
  const { node, section, redirectTo } = await loadWebsiteSectionPageByAlias({
    graphqlClient: req.$baseCMSGraphQLClient,
    alias: isFn(aliasResolver) ? await aliasResolver({ req, reply }) : req.params.alias,
    requestPath: req.url,
    nodeQueryFragment,
    redirectOnPathMismatch,
    loaderAdditionalInput,
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
