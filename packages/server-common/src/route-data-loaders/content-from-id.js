import createError from 'http-errors';
import { extractFragmentData, gql } from '@parameter1/base-web-graphql';
import { isFunction as isFn } from '@parameter1/base-web-utils';
import RouteDataNode from './-node.js';

export const defaultFragment = gql`
  fragment ContentRouteDataFromIdFragment on WebsiteSection {
    id
    type
    redirectTo
    siteContext {
      path
    }
  }
`;

export function buildGraphQLOperation({ fragment } = {}) {
  const { spreadFragmentName, processedFragment } = extractFragmentData(fragment);
  return gql`
    query ContentRouteDataFromId($input: ContentQueryInput!) {
      content(input: $input) {
        ...ContentRouteDataFromIdFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
}

const buildInput = ({ id, previewMode }) => ({
  id,
  ...(previewMode ? { status: 'any' } : { since: Date.now() }),
});

export async function executeQuery({
  graphqlClient,
  id,
  previewMode = false,
  fragment,
} = {}) {
  const contentId = parseInt(id, 10);
  if (!contentId) throw createError(400, 'No content ID was provided.');
  const input = buildInput({ id, previewMode });
  const { data } = await graphqlClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input },
  });
  const { content } = data;
  if (!content) throw createError(404, `No content was found for id '${id}'`);
  return content;
}

export default async ({
  graphqlClient,
  id,
  requestPath,
  nodeQueryFragment,
  previewMode = false,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
} = {}) => {
  const content = await executeQuery({ graphqlClient, id, fragment: loaderQueryFragment });
  const redirectTo = isFn(redirectToFn) ? redirectToFn({ content }) : content.redirectTo;
  if (redirectTo) return { content, redirectTo };

  const canonicalPath = isFn(canonicalPathFn)
    ? canonicalPathFn({ content })
    : content.siteContext.path;
  if (redirectOnPathMismatch && canonicalPath !== requestPath) {
    return { content, redirectTo: canonicalPath };
  }

  // @todo determine if a second query should be executed.
  const node = RouteDataNode({
    graphqlClient,
    variables: { input: buildInput({ id: content.id, previewMode }) },
    operationBuilder: buildGraphQLOperation,
    fragment: nodeQueryFragment,
    resultField: 'content',
  });
  return { node, content };
};
