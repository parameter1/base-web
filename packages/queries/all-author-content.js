const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment AllAuthorContentBlockLoaderFragment on Content {
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
    query AllAuthorContentBlockLoader($input: AllAuthorContentQueryInput!) {
      allAuthorContent(input: $input) {
        edges {
          node {
            ...AllAuthorContentBlockLoaderFragment
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

const date = (v) => (v instanceof Date ? v.valueOf() : v);

const executeQuery = async (baseCMSGraphQLClient, {
  limit,
  skip,
  after,

  contactId,
  since,
  authorTypes,

  sortField: field,
  sortOrder: order,

  includeContentTypes,
  requiresImage,
  withSite,
  siteId,

  queryFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    contactId,
    authorTypes,
    includeContentTypes,
    pagination,
    requiresImage,
    withSite,
    siteId,
    since: date(since),
  };
  if (field || order) input.sort = { field, order };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.allAuthorContent) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.allAuthorContent;
  const nodes = data.allAuthorContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
