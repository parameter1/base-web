const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment WebsiteSectionsBlockLoaderFragment on WebsiteSection {
    id
    alias
    name
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query WebsiteSectionsBlockLoader($input: WebsiteSectionsQueryInput = {}) {
      websiteSections(input: $input) {
        edges {
          node {
            ...WebsiteSectionsBlockLoaderFragment
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
  status,
  includeIds,
  limit,
  taxonomyIds,
  rootOnly,
  queryFragment,
  sort,
} = {}) => {
  const pagination = { limit };
  const input = {
    pagination,
    status,
    includeIds,
    sort,
    taxonomyIds,
    rootOnly,
  };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.websiteSections) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.websiteSections;
  const nodes = data.websiteSections.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
