const createError = require('http-errors');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const gql = require('@parameter1/base-web-graphql-lib/tag');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const previewModeInput = require('../graphql/input-builders/content-preview-mode');
const RouteDataNode = require('./-node');

const defaultFragment = gql`
  fragment ContentRouteDataFromIdFragment on Content {
    id
    type
    redirectTo
    siteContext {
      path
    }
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
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
};

const buildInput = ({ id, previewMode }) => previewModeInput({
  input: { id },
  enabled: previewMode,
});

const executeQuery = async ({
  baseCMSGraphQLClient,
  id,
  previewMode = false,
  fragment,
} = {}) => {
  const contentId = parseInt(id, 10);
  if (!contentId) throw createError(400, 'No content ID was provided.');
  const input = buildInput({ id: contentId, previewMode });
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input },
  });
  const { content } = data;
  if (!content) throw createError(404, `No content was found for id '${id}'`);
  return content;
};

module.exports = async ({
  baseCMSGraphQLClient,
  id,
  request,
  nodeQueryFragment,
  previewMode = false,
  redirectOnPathMismatch = true,
  loaderQueryFragment,
  redirectToFn,
  canonicalPathFn,
} = {}) => {
  const content = await executeQuery({
    baseCMSGraphQLClient,
    id,
    previewMode,
    fragment: loaderQueryFragment,
  });
  const redirectTo = isFn(redirectToFn) ? redirectToFn({ content }) : content.redirectTo;
  if (redirectTo) return { content, redirectTo };

  const canonicalPath = isFn(canonicalPathFn)
    ? canonicalPathFn({ content })
    : content.siteContext.path;
  if (redirectOnPathMismatch && canonicalPath !== request.path) {
    return { content, redirectTo: canonicalPath };
  }

  // @todo determine if a second query should be executed.
  const node = RouteDataNode({
    baseCMSGraphQLClient,
    variables: { input: buildInput({ id: content.id, previewMode }) },
    operationBuilder: buildGraphQLOperation,
    fragment: nodeQueryFragment,
    resultField: 'content',
  });
  return { node, content };
};
