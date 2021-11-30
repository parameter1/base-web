const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const date = require('./utils/date');

const defaultFragment = gql`
  fragment AllCompanyContentBlockLoaderFragment on Content {
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
    query AllCompanyContentBlockLoader($input: AllCompanyContentQueryInput!) {
      allCompanyContent(input: $input) {
        edges {
          node {
            ...AllCompanyContentBlockLoaderFragment
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

  companyId,
  since,

  sortField: field,
  sortOrder: order,

  includeContentTypes,
  excludeContentTypes,
  includeLabels,
  excludeLabels,
  requiresImage,
  withSite,
  siteId,

  queryFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    companyId,
    includeContentTypes,
    excludeContentTypes,
    includeLabels,
    excludeLabels,
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
  if (!data || !data.allCompanyContent) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.allCompanyContent;
  const nodes = data.allCompanyContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
