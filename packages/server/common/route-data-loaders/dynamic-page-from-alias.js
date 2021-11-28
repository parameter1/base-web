const createError = require('http-errors');
const { cleanPath } = require('@parameter1/base-web-utils');
const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const { buildGraphQLOperation: buildPageOperation } = require('@parameter1/base-web-queries/dynamic-page-from-alias');
const RouteDataNode = require('./-node');

const defaultFragment = gql`
  fragment DynamicPageRouteDataFromAliasFragment on ContentPage {
    id
    alias
    redirectTo
    siteContext {
      path
      canonicalUrl
      noIndex
    }
    metadata {
      title
      description
    }
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    query DynamicPageRouteDataFromAlias($input: ContentPageQueryInput!) {
      page: contentPage(input: $input) {
        ...DynamicPageRouteDataFromAliasFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async ({ baseCMSGraphQLClient, alias, fragment } = {}) => {
  const cleanedAlias = cleanPath(alias);
  if (!cleanedAlias) throw createError(400, 'No content page alias was provided.');
  const input = { alias: cleanedAlias };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input, redirect: input },
  });
  const { page } = data;
  if (!page) throw createError(404, `No content page was found for '${cleanedAlias}'`);
  return page;
};

const signalRedirect = ({ page, redirectTo }) => {
  if (cleanPath(page.alias) === cleanPath(redirectTo)) {
    throw createError(500, 'An infinite section redirect was detected.');
  }
  return { page, redirectTo };
};

module.exports = async ({
  baseCMSGraphQLClient,
  alias,
  request,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => {
  const page = await executeQuery({
    baseCMSGraphQLClient,
    alias,
    fragment: loaderQueryFragment,
  });
  const { redirectTo } = page;
  if (redirectTo) return signalRedirect({ page, redirectTo });

  const { path } = page.siteContext;
  if (redirectOnPathMismatch && path !== request.path) {
    return signalRedirect({ page, redirectTo: path });
  }

  const node = RouteDataNode({
    baseCMSGraphQLClient,
    variables: { input: { alias: page.alias } },
    operationBuilder: buildPageOperation,
    queryFragment: nodeQueryFragment,
    resultField: 'section',
  });
  return { node, page };
};
