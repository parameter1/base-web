import createError from 'http-errors';
import { cleanPath } from '@parameter1/base-web-utils';
import { extractFragmentData, gql } from '@parameter1/base-web-graphql';
import { buildGraphQLOperation as buildSectionOperation } from '../block-loaders/website-section-alias.js';
import PageNode from './-node.js';

export const defaultFragment = gql`
  fragment WebsiteSectionAliasPageLoaderFragment on WebsiteSection {
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
    query WebsiteSectionAliasPageLoader($input: WebsiteSectionAliasQueryInput!, $redirect: WebsiteSectionRedirectQueryInput!) {
      section: websiteSectionAlias(input: $input) {
        ...WebsiteSectionAliasPageLoaderFragment
        ${spreadFragmentName}
      }
      redirect: websiteSectionRedirect(input: $redirect) {
        ...WebsiteSectionAliasPageLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
}

export async function loadWebsiteSection({
  graphqlClient,
  alias,
  additionalInput,
  fragment,
}) {
  const cleanedAlias = cleanPath(alias);
  if (!cleanedAlias) throw createError(400, 'No website section alias was provided.');
  const input = { ...additionalInput, alias: cleanedAlias };
  const { data } = await graphqlClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input, redirect: input },
  });
  const { section, redirect } = data;
  if (section && section.alias) return section;
  if (redirect && redirect.alias) return redirect;
  throw createError(404, `No website section was found for alias '${cleanedAlias}'`);
}

/**
 * @param {object} params
 * @param {ApolloClient} params.graphqlClient The BaseCMS GraphQL Apollo client.
 * @param {string} params.alias The website section alias to lookup.
 * @param {string} params.requestPath The current HTTP request path.
 * @param {object} [params.nodeQueryFragment] A WebsiteSection fragment to apply to the _node_.
 * @param {boolean} [params.redirectOnPathMismatch=true] Whether to signal a redirect when the
 *                                                       the current request path does not equal the
 *                                                       section alias.
 * @param {object} [params.loaderAdditionalInput] Additional query input to pass to the website
 *                                                section query loader.
 * @param {object} [params.loaderQueryFragment] A WebsiteSection fragment to apply to the _loader_.
 * @returns {Promise<object>}
 */
export default async ({
  graphqlClient,
  alias,
  requestPath,
  nodeQueryFragment,
  redirectOnPathMismatch = true,
  loaderAdditionalInput,
  loaderQueryFragment,
} = {}) => {
  const section = await loadWebsiteSection({
    graphqlClient,
    alias,
    additionalInput: loaderAdditionalInput,
    fragment: loaderQueryFragment,
  });
  const { redirectTo, canonicalPath } = section;
  if (redirectTo) return { section, redirectTo };
  if (redirectOnPathMismatch && canonicalPath !== requestPath) {
    return { section, redirectTo: canonicalPath };
  }

  // @todo determine if a second query should be executed.
  const node = PageNode({
    graphqlClient,
    variables: { input: { alias: section.alias } },
    operationBuilder: buildSectionOperation,
    fragment: nodeQueryFragment,
    resultField: 'section',
  });
  return { node, section };
};
