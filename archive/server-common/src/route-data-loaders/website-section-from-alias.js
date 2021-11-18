import createError from 'http-errors';
import { cleanPath } from '@parameter1/base-web-utils';
import { extractFragmentData, gql } from '@parameter1/base-web-graphql';
import { buildGraphQLOperation as buildSectionOperation } from '../block-loaders/website-section-alias.js';
import RouteDataNode from './-node.js';

export const defaultFragment = gql`
  fragment WebsiteSectionRouteDataFromAliasFragment on WebsiteSection {
    id
    alias
    name
    redirectTo
    canonicalPath
  }
`;

export function buildGraphQLOperation({ fragment } = {}) {
  const { spreadFragmentName, processedFragment } = extractFragmentData(fragment);
  return gql`
    query WebsiteSectionRouteDataFromAlias($input: WebsiteSectionAliasQueryInput!, $redirect: WebsiteSectionRedirectQueryInput!) {
      section: websiteSectionAlias(input: $input) {
        ...WebsiteSectionRouteDataFromAliasFragment
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
}

export async function executeQuery({ graphqlClient, alias, fragment } = {}) {
  const cleanedAlias = cleanPath(alias);
  if (!cleanedAlias) throw createError(400, 'No website section alias was provided.');
  const input = { alias: cleanedAlias };
  const { data } = await graphqlClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input, redirect: input },
  });
  const { section, redirect } = data;
  if (section && section.alias) return section;
  if (redirect && redirect.alias) return redirect;
  throw createError(404, `No website section was found for '${cleanedAlias}'`);
}

const signalRedirect = ({ section, redirectTo }) => {
  if (cleanPath(section.alias) === cleanPath(redirectTo)) {
    throw createError(500, 'An infinite section redirect was detected.');
  }
  return { section, redirectTo };
};

/**
 * @param {object} params
 * @param {ApolloClient} params.graphqlClient The BaseCMS GraphQL Apollo client.
 * @param {string} params.alias The website section alias to lookup.
 * @param {string} params.requestPath The current HTTP request path.
 * @param {object} [params.nodeQueryFragment] A WebsiteSection fragment to apply to the _node_.
 * @param {boolean} [params.redirectOnPathMismatch=true] Whether to signal a redirect when the
 *                                                       the current request path does not equal the
 *                                                       section alias.
 * @param {object} [params.loaderQueryFragment] A WebsiteSection fragment to apply to the _loader_.
 * @returns {Promise<object>}
 */
export default async ({
  graphqlClient,
  alias,
  requestPath,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
} = {}) => {
  const section = await executeQuery({ graphqlClient, alias, fragment: loaderQueryFragment });
  const { redirectTo, canonicalPath } = section;
  if (redirectTo) return signalRedirect({ section, redirectTo });
  if (redirectOnPathMismatch && canonicalPath !== requestPath) {
    return signalRedirect({ section, redirectTo: canonicalPath });
  }

  // @todo determine if a second query should be executed.
  const node = RouteDataNode({
    graphqlClient,
    variables: { input: { alias: section.alias } },
    operationBuilder: buildSectionOperation,
    fragment: nodeQueryFragment,
    resultField: 'section',
  });
  return { node, section };
};
