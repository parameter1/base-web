const createError = require('http-errors');
const { cleanPath } = require('@parameter1/base-web-utils');
const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const { buildGraphQLOperation: buildSectionOperation } = require('@parameter1/base-web-queries/website-section-from-alias');
const RouteDataNode = require('./-node');

const defaultFragment = gql`
  fragment WebsiteSectionRouteDataFromAliasFragment on WebsiteSection {
    id
    alias
    name
    redirectTo
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    query WebsiteSectionRouteDataFromAlias($input: WebsiteSectionAliasQueryInput!, $redirect: WebsiteSectionRedirectQueryInput!) {
      section: websiteSectionAlias(input: $input) {
        ...WebsiteSectionRouteDataFromAliasFragment
        metadata { title description }
        ${spreadFragmentName}
      }
      redirect: websiteSectionRedirect(input: $redirect) {
        ...WebsiteSectionRouteDataFromAliasFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async ({ baseCMSGraphQLClient, alias, fragment } = {}) => {
  const cleanedAlias = cleanPath(alias);
  if (!cleanedAlias) throw createError(400, 'No website section alias was provided.');
  const input = { alias: cleanedAlias };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input, redirect: input },
  });
  const { section, redirect } = data;
  if (section && section.alias) return section;
  if (redirect && redirect.alias) return redirect;
  throw createError(404, `No website section was found for '${cleanedAlias}'`);
};

const signalRedirect = ({ section, redirectTo }) => {
  if (cleanPath(section.alias) === cleanPath(redirectTo)) {
    throw createError(500, 'An infinite section redirect was detected.');
  }
  return { section, redirectTo };
};

/**
 * @param {object} params
 * @param {ApolloClient} params.baseCMSGraphQLClient The BaseCMS GraphQL Apollo client.
 * @param {string} params.alias The website section alias to lookup.
 * @param {string} params.requestPath The current HTTP request path.
 * @param {object} [params.nodeQueryFragment] A WebsiteSection fragment to apply to the _node_.
 * @param {boolean} [params.redirectOnPathMismatch=true] Whether to signal a redirect when the
 *                                                       the current request path does not equal the
 *                                                       section alias.
 * @param {object} [params.loaderQueryFragment] A WebsiteSection fragment to apply to the _loader_.
 * @returns {Promise<object>}
 */
module.exports = async ({
  baseCMSGraphQLClient,
  alias,
  request,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => {
  const section = await executeQuery({
    baseCMSGraphQLClient,
    alias,
    fragment: loaderQueryFragment,
  });
  const { redirectTo, canonicalPath } = section;
  if (redirectTo) return signalRedirect({ section, redirectTo });
  if (redirectOnPathMismatch && canonicalPath !== request.path) {
    return signalRedirect({ section, redirectTo: canonicalPath });
  }

  const node = RouteDataNode({
    baseCMSGraphQLClient,
    variables: { input: { alias: section.alias } },
    operationBuilder: buildSectionOperation,
    queryFragment: nodeQueryFragment,
    resultField: 'section',
  });
  return { node, section };
};
