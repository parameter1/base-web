const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MostPopularContentBlockLoaderFragment on Content {
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
    query MostPopularContentBlockLoader($input: QueryMostPopularContentInput!) {
      mostPopularContent(input: $input) {
        edges {
          node {
            id
            uniqueUsers
            views
            content {
              ...MostPopularContentBlockLoaderFragment
              ${spreadFragmentName}
            }
          }
        }
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  limit,

  queryFragment,
} = {}) => {
  const input = { limit };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.mostPopularContent) return { nodes: [], pageInfo: {} };
  const nodes = data.mostPopularContent.edges.reduce((arr, edge) => {
    if (edge && edge.node && edge.node.content) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
