const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment RelatedPublishedContentBlockLoaderFragment on Content {
    id
    type
    siteContext {
      path
    }
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query RelatedPublishedContentBlockLoader($input: RelatedPublishedContentQueryInput!) {
      relatedPublishedContent(input: $input) {
        edges {
          node {
            ...RelatedPublishedContentBlockLoaderFragment
            ${spreadFragmentName}
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  limit,
  skip,
  after,

  contentId,
  queryTypes,

  excludeContentTypes,
  includeContentTypes,
  requiresImage,
  withSite,

  queryFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    contentId,
    queryTypes,
    pagination,
    excludeContentTypes,
    includeContentTypes,
    requiresImage,
    withSite,
  };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.relatedPublishedContent) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.relatedPublishedContent;
  const nodes = data.relatedPublishedContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
